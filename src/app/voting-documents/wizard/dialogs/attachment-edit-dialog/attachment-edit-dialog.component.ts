/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { RadioButton } from '@abraxas/base-components';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attachment, AttachmentCategory, AttachmentFormat } from '../../../../models/attachment.model';
import { EnumUtil } from '../../../../services/enum.util';
import { AttachmentService } from '../../../../services/attachment.service';
import { ToastService } from '../../../../services/toast.service';
import { fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { PropertyRefresherService } from '../../../../services/property-refresher.service';
import { CheckableItems } from 'src/app/models/checkable-item.model';
import { groupBy } from '../../../../services/utils/array.utils';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { DomainOfInfluenceType } from '../../../../models/domain-of-influence.model';
import { sortByCategory } from '../../../../services/utils/attachment.utils';

@Component({
  selector: 'app-attachment-edit-dialog',
  templateUrl: './attachment-edit-dialog.component.html',
  styleUrls: ['./attachment-edit-dialog.component.scss'],
})
export class AttachmentEditDialogComponent implements OnInit {
  public readonly isNew: boolean = false;
  public readonly attachmentCategoryRadioButtons: RadioButton[] = [];
  public readonly attachmentFormatRadioButtons: RadioButton[] = [];
  public readonly requireExplicitRequiredCount: boolean = false;

  public saving = false;
  public deleting = false;

  public attachment!: Attachment;
  public deliveryPlannedOn?: string;
  public validDeliveryDate = false;
  public isSingleAttendeeContest = false;
  public isPoliticalAssembly = false;

  public formatConsultationRequired = false;
  public formatConsultationChecked = false;

  public doiNameCheckablePoliticalBusinessesPairs!: Record<string, CheckableItems<PoliticalBusiness>>;

  private readonly oldCategory: AttachmentCategory;

  constructor(
    private readonly dialogRef: MatDialogRef<AttachmentEditDialogComponent, AttachmentEditDialogResult>,
    private readonly attachmentService: AttachmentService,
    private readonly toast: ToastService,
    private readonly propertyRefresher: PropertyRefresherService,
    enumUtil: EnumUtil,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentEditDialogData,
  ) {
    this.attachment = data.attachment;
    this.isSingleAttendeeContest = data.isSingleAttendeeContest;
    this.isPoliticalAssembly = data.isPoliticalAssembly;
    this.isNew = !this.attachment.id;
    this.deliveryPlannedOn = toBcDate(this.attachment.deliveryPlannedOn);
    this.oldCategory = this.attachment.category;

    const doiType = this.attachment.domainOfInfluence.type;
    this.requireExplicitRequiredCount =
      doiType !== DomainOfInfluenceType.DOMAIN_OF_INFLUENCE_TYPE_CH &&
      doiType !== DomainOfInfluenceType.DOMAIN_OF_INFLUENCE_TYPE_CT &&
      doiType !== DomainOfInfluenceType.DOMAIN_OF_INFLUENCE_TYPE_BZ;

    this.attachmentCategoryRadioButtons = enumUtil
      .getArrayWithDescriptions<AttachmentCategory>(AttachmentCategory, 'ATTACHMENT.CATEGORIES.')
      .map(i => ({ value: i.value, displayText: i.description }));
    sortByCategory(v => v.value, this.attachmentCategoryRadioButtons);

    this.attachmentFormatRadioButtons = enumUtil
      .getArrayWithDescriptions<AttachmentFormat>(AttachmentFormat, 'ATTACHMENT.EDIT_FORMATS.')
      .map(i => ({ value: i.value, displayText: i.description }));

    this.doiNameCheckablePoliticalBusinessesPairs = CheckableItems.buildFromRecords(
      groupBy(this.attachment.checkablePoliticalBusinesses.items, x => x.item.domainOfInfluence.name),
    );

    // A5 should be the first choice.
    const temp = this.attachmentFormatRadioButtons[0];
    this.attachmentFormatRadioButtons[0] = this.attachmentFormatRadioButtons[1];
    this.attachmentFormatRadioButtons[1] = temp;
  }

  public ngOnInit(): Promise<void> {
    this.updateFormatConsultationRequired();
    this.formatConsultationChecked = this.formatConsultationRequired;
    return this.updateValidDeliveryDate();
  }

  public async save(): Promise<void> {
    this.attachment.deliveryPlannedOn = fromBcDate(this.deliveryPlannedOn);

    if (this.requireExplicitRequiredCount) {
      this.attachment.orderedCount = this.attachment.domainOfInfluenceAttachmentRequiredCount!;
    } else {
      this.attachment.domainOfInfluenceAttachmentRequiredCount = 0;
    }

    this.saving = true;
    try {
      if (this.isNew) {
        this.attachment.id = await this.attachmentService.create(this.attachment);
      } else {
        await this.attachmentService.update(this.attachment);
      }

      this.toast.saved();
      this.done(this.attachment);
    } finally {
      this.saving = false;
    }
  }

  public async delete(): Promise<void> {
    this.deleting = true;
    try {
      await this.attachmentService.delete(this.attachment.id);
      this.toast.deleted();
      this.done(this.attachment, true);
    } finally {
      this.deleting = false;
    }
  }

  public done(attachment?: Attachment, deleted?: boolean): void {
    if (!!attachment) {
      this.dialogRef.close({
        attachment: attachment,
        deleted,
        oldCategory: this.oldCategory,
      });
      return;
    }

    this.dialogRef.close();
  }

  public async updateValidDeliveryDate(): Promise<void> {
    if (!this.deliveryPlannedOn) {
      this.validDeliveryDate = false;
      return;
    }

    const deliveryPlannedOn = fromBcDate(this.deliveryPlannedOn)!;
    await this.propertyRefresher.updateBooleanProperty(
      this,
      'validDeliveryDate',
      deliveryPlannedOn <= this.data.attachmentDeliveryDeadlineDate,
    );
  }

  public updateFormatConsultationRequired() {
    this.formatConsultationRequired =
      this.attachment.format === AttachmentFormat.ATTACHMENT_FORMAT_A4 || this.attachment.format === AttachmentFormat.ATTACHMENT_FORMAT_A6;

    if (!this.formatConsultationRequired) {
      this.formatConsultationChecked = false;
    }
  }
}

export interface AttachmentEditDialogData {
  attachment: Attachment;
  attachmentDeliveryDeadlineDate: Date;
  isSingleAttendeeContest: boolean;
  isPoliticalAssembly: boolean;
}

export interface AttachmentEditDialogResult {
  attachment: Attachment;
  deleted?: boolean;
  oldCategory: AttachmentCategory;
}
