/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnChanges, inject } from '@angular/core';
import { Attachment, AttachmentTableEntry } from '../../../../models/attachment.model';
import { DialogService } from '../../../../services/dialog.service';
import { isAttachment, showRequiredForVoterListsCount } from '../../../../services/utils/attachment.utils';
import { AttachmentStateDialogComponent, AttachmentStateDialogData } from '../../attachment-state-dialog/attachment-state-dialog.component';
import {
  AttachmentStationDialogComponent,
  AttachmentStationDialogData,
} from '../../attachment-station-dialog/attachment-station-dialog.component';
import { Contest } from '../../../../models/contest.model';
import {
  AttachmentEditDialogComponent,
  AttachmentEditDialogData,
  buildAttachmentEditDialogData,
} from '../../../dialogs/attachment-edit-dialog/attachment-edit-dialog.component';

@Component({
  selector: 'app-contest-overview-attachment-table',
  templateUrl: './contest-overview-attachment-table.component.html',
  styleUrls: ['./contest-overview-attachment-table.component.scss'],
  standalone: false,
})
export class ContestOverviewAttachmentTableComponent implements OnChanges {
  private readonly dialog = inject(DialogService);

  public columns: string[] = [];

  @Input()
  public entries: AttachmentTableEntry[] = [];

  @Input()
  public contest!: Contest;

  @Input()
  public forPrintJobManagement = false;

  public readonly isAttachment = isAttachment;
  public readonly showRequiredForVoterListsCount = showRequiredForVoterListsCount;

  public async setStation(attachment: Attachment): Promise<void> {
    const data: AttachmentStationDialogData = {
      attachment,
      otherDomainOfInfluenceAttachments: this.getAttachments().filter(
        a => a.id !== attachment.id && a.domainOfInfluence.id === attachment.domainOfInfluence.id,
      ),
    };

    await this.dialog.openForResult(AttachmentStationDialogComponent, data);
  }

  public async setState(attachment: Attachment): Promise<void> {
    const data: AttachmentStateDialogData = {
      attachment,
    };

    await this.dialog.openForResult(AttachmentStateDialogComponent, data);
  }

  public async open(row: AttachmentTableEntry): Promise<void> {
    if (!isAttachment(row)) {
      return;
    }

    const attachment = row as Attachment;
    const data = buildAttachmentEditDialogData(attachment, this.contest, false);
    await this.dialog.openForResult(AttachmentEditDialogComponent, data);
  }

  public isSelectionDisabled = (row: Attachment): boolean => {
    return !isAttachment(row);
  };

  public ngOnChanges(): void {
    this.columns = [
      'category',
      'authority',
      'domainOfInfluence',
      'name',
      'orderedCount',
      'requiredCount',
      'requiredForVoterListsCount',
      'format',
      'color',
      'supplier',
      'deliveryPlannedOn',
      'deliveryReceivedOn',
      'station',
      'state',
    ];

    if (this.forPrintJobManagement) {
      this.columns.splice(this.columns.length, 0, 'stateChange');
    }
  }

  private getAttachments(): Attachment[] {
    return this.entries.filter(isAttachment) as Attachment[];
  }
}
