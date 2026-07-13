/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject, OnInit } from '@angular/core';
import { Attachment } from '../../../models/attachment.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../services/toast.service';
import { AttachmentService } from '../../../services/attachment.service';
import { fromBcDate, toBcDate } from '../../../services/utils/date.utils';

@Component({
  selector: 'app-attachment-delayed-delivery-date-dialog',
  styleUrls: ['./attachment-delayed-delivery-date-dialog.component.scss'],
  templateUrl: './attachment-delayed-delivery-date-dialog.component.html',
  standalone: false,
})
export class AttachmentDelayedDeliveryDateDialogComponent implements OnInit {
  public readonly data = inject<AttachmentDelayedDeliveryDateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<AttachmentDelayedDeliveryDateDialogComponent>>(MatDialogRef);
  private readonly attachmentService = inject(AttachmentService);
  private readonly toast = inject(ToastService);

  public saving: boolean = false;
  public delayedDeliveryDate?: string;
  public validDelayedDeliveryDate = false;
  public canDelete = false;

  public ngOnInit(): void {
    this.canDelete = !!this.data.attachment.delayedDeliveryDate;
    this.delayedDeliveryDate = toBcDate(this.data.attachment.delayedDeliveryDate);
  }

  public async save(delayedDeliveryDate?: string): Promise<void> {
    this.saving = true;
    try {
      const date = delayedDeliveryDate ? fromBcDate(delayedDeliveryDate) : undefined;
      await this.attachmentService.updateDelayedDeliveryDate(this.data.attachment.id, date);
      this.toast.saved();
      this.data.attachment.delayedDeliveryDate = date;
      this.done();
    } finally {
      this.saving = false;
    }
  }

  public done(): void {
    this.dialogRef.close();
  }

  public async updateDelayedDeliveryDate(e: string): Promise<void> {
    this.delayedDeliveryDate = e;
    const delayedDeliveryDate = fromBcDate(e);
    this.validDelayedDeliveryDate = !!delayedDeliveryDate && delayedDeliveryDate > this.data.attachment.deliveryPlannedOn!;
  }
}

export interface AttachmentDelayedDeliveryDateDialogData {
  attachment: Attachment;
}
