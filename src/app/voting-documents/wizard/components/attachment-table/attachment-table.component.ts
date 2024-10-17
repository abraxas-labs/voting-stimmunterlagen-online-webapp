/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import {
  Attachment,
  AttachmentTableEntry,
  DomainOfInfluenceAttachmentCategorySummariesEntry,
  mapToAttachmentTableEntries,
  newAttachment,
  newAttachmentCategorySummary,
} from '../../../../models/attachment.model';
import { CheckableItems } from '../../../../models/checkable-item.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { DialogService } from '../../../../services/dialog.service';
import { cloneDeep } from 'lodash';
import { StepInfo } from '../../../../models/step.model';
import {
  AttachmentCountDialogComponent,
  AttachmentCountDialogData,
} from '../../dialogs/attachment-count-dialog/attachment-count-dialog.component';
import {
  AttachmentEditDialogComponent,
  AttachmentEditDialogData,
  AttachmentEditDialogResult,
} from '../../dialogs/attachment-edit-dialog/attachment-edit-dialog.component';
import {
  AttachmentDomainOfInfluencesDialogComponent,
  AttachmentDomainOfInfluencesDialogData,
} from '../../dialogs/attachment-domain-of-influences-dialog/attachment-domain-of-influences-dialog.component';
import { isAttachment, sortByCategory } from '../../../../services/utils/attachment.utils';

@Component({
  selector: 'app-attachment-table',
  templateUrl: './attachment-table.component.html',
  styleUrls: ['./attachment-table.component.scss'],
})
export class AttachmentTableComponent implements OnChanges {
  public columns: string[] = [];
  public entries: AttachmentTableEntry[] = [];

  @Output()
  public updated: EventEmitter<Attachment> = new EventEmitter<Attachment>();

  private domainOfInfluenceAttachmentCategorySummariesEntryValue!: DomainOfInfluenceAttachmentCategorySummariesEntry;

  public get domainOfInfluenceAttachmentCategorySummariesEntry(): DomainOfInfluenceAttachmentCategorySummariesEntry {
    return this.domainOfInfluenceAttachmentCategorySummariesEntryValue;
  }

  @Input()
  public stepInfo!: StepInfo;

  @Input()
  public canEdit = false;

  @Input()
  public set domainOfInfluenceAttachmentCategorySummariesEntry(v: DomainOfInfluenceAttachmentCategorySummariesEntry) {
    if (v === this.domainOfInfluenceAttachmentCategorySummariesEntry) {
      return;
    }

    this.domainOfInfluenceAttachmentCategorySummariesEntryValue = v;
    this.entries = mapToAttachmentTableEntries(v.attachmentCategorySummaries);
  }

  constructor(private readonly dialog: DialogService, private readonly attachmentService: AttachmentService) {}

  public readonly isAttachment = isAttachment;

  public ngOnChanges(): void {
    this.columns = [
      'category',
      'name',
      'orderedCount',
      'color',
      'supplier',
      ...this.domainOfInfluenceAttachmentCategorySummariesEntry.politicalBusinesses.map(pb => pb.id),
      'domainOfInfluencesExclude',
    ];

    if (this.domainOfInfluenceAttachmentCategorySummariesEntry.domainOfInfluence.type <= this.stepInfo.domainOfInfluence.type) {
      this.columns.splice(3, 0, 'requiredCount');
    }
  }

  public async createOrEdit(attachment?: Attachment): Promise<void> {
    if (attachment) {
      if (this.isSelectionDisabled(attachment)) {
        return;
      }
    }
    if (!this.stepInfo.contest || !this.canEdit) {
      return;
    }

    attachment = !attachment
      ? newAttachment(
          this.domainOfInfluenceAttachmentCategorySummariesEntry.domainOfInfluence,
          new CheckableItems(
            this.domainOfInfluenceAttachmentCategorySummariesEntry.politicalBusinesses.map(pb => ({ item: pb, checked: false })),
            { disabledWhenOnlyOneChecked: true },
          ),
        )
      : cloneDeep(attachment);

    const data: AttachmentEditDialogData = {
      attachment,
      attachmentDeliveryDeadlineDate: this.stepInfo.contest.attachmentDeliveryDeadlineDate!,
      isSingleAttendeeContest: this.stepInfo.contest.isSingleAttendeeContest,
      isPoliticalAssembly: this.stepInfo.contest.isPoliticalAssembly,
    };

    this.handleEditAttachmentDialogResult(await this.dialog.openForResult(AttachmentEditDialogComponent, data));
  }

  public async updatePoliticalBusinessChecked(attachment: Attachment, index: number, checked: boolean): Promise<void> {
    const checkablePoliticalBusiness = attachment.checkablePoliticalBusinesses.items[index];

    if (checkablePoliticalBusiness.checked === checked) {
      return;
    }

    const pbId = checkablePoliticalBusiness.item.id;

    if (checked) {
      await this.attachmentService.assignPoliticalBusiness(attachment.id, pbId);
    } else {
      await this.attachmentService.unassignPoliticalBusiness(attachment.id, pbId);
    }

    attachment.checkablePoliticalBusinesses.updateChecked(checkablePoliticalBusiness, checked);
  }

  public handleEditAttachmentDialogResult(result?: AttachmentEditDialogResult): void {
    if (!result) {
      return;
    }

    const attachment = result.attachment;
    let categorySummary = this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries.find(
      s => s.category === attachment.category,
    );

    if (result.deleted) {
      categorySummary!.attachments = categorySummary!.attachments.filter(x => x.id !== attachment.id);
      this.refreshSummaries();
      return;
    }

    if (!!result.oldCategory && result.oldCategory !== attachment.category) {
      const oldCategorySummary = this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries.find(
        s => s.category === result.oldCategory,
      )!;
      oldCategorySummary.attachments = oldCategorySummary.attachments.filter(a => a.id !== attachment.id);
    }

    if (!categorySummary) {
      categorySummary = newAttachmentCategorySummary(attachment.category);
      this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries.push(categorySummary);
    }

    const existingAttachmentIndex = categorySummary.attachments.findIndex(a => a.id === attachment.id);
    if (existingAttachmentIndex < 0) {
      categorySummary.attachments = [...categorySummary.attachments, attachment];
    } else {
      categorySummary.attachments[existingAttachmentIndex] = attachment;
      this.updated.emit(attachment);
    }

    this.refreshSummaries();
  }

  public async setOrderedCount(attachment: Attachment): Promise<void> {
    const data: AttachmentCountDialogData = {
      attachment,
      domainOfInfluenceId: this.stepInfo.domainOfInfluence.id,
    };

    await this.dialog.openForResult(AttachmentCountDialogComponent, data);
    this.updated.emit(attachment);
  }

  public async updateDomainOfInfluenceEntries(attachment: Attachment): Promise<void> {
    const data: AttachmentDomainOfInfluencesDialogData = {
      attachment,
    };

    await this.dialog.openForResult(AttachmentDomainOfInfluencesDialogComponent, data);
    this.updated.emit(attachment);
  }

  public showRequiredCount(element: Attachment): boolean {
    return (
      !isAttachment(element) ||
      !this.canEdit ||
      this.stepInfo.domainOfInfluence.id === this.domainOfInfluenceAttachmentCategorySummariesEntry.domainOfInfluence.id ||
      this.domainOfInfluenceAttachmentCategorySummariesEntry.domainOfInfluence.type > this.stepInfo.domainOfInfluence.type
    );
  }

  public isSelectionDisabled = (row: Attachment): boolean => {
    return !(isAttachment(row) && this.canEdit && row.domainOfInfluence.id === this.stepInfo.domainOfInfluence.id);
  };

  private refreshSummaries(): void {
    const emptyCategories = this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries
      .filter(s => s.attachments.length === 0)
      .map(s => s.category);

    // removes category summaries which have no attachments
    if (emptyCategories.length > 0) {
      this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries =
        this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries.filter(
          s => !emptyCategories.includes(s.category),
        );
    }

    // set summary totals
    for (const summary of this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries) {
      summary.totalOrderedCount = 0;
      summary.totalRequiredCount = 0;

      for (const attachment of summary.attachments) {
        summary.totalOrderedCount += attachment.orderedCount;
        summary.totalRequiredCount += attachment.domainOfInfluenceAttachmentRequiredCount ?? 0;
      }
    }

    sortByCategory(v => v.category, this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries);
    this.entries = mapToAttachmentTableEntries(this.domainOfInfluenceAttachmentCategorySummariesEntry.attachmentCategorySummaries);
  }
}
