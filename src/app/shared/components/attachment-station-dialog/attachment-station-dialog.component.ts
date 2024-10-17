/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attachment } from '../../../models/attachment.model';
import { AttachmentService } from '../../../services/attachment.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-attachment-station-dialog',
  templateUrl: './attachment-station-dialog.component.html',
  styleUrls: ['./attachment-station-dialog.component.scss'],
})
export class AttachmentStationDialogComponent {
  public saving = false;
  public station?: number;

  constructor(
    private readonly dialogRef: MatDialogRef<AttachmentStationDialogComponent>,
    private readonly attachmentService: AttachmentService,
    private readonly toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentStationDialogData,
  ) {
    this.station = data.attachment.station;
  }

  public async save(): Promise<void> {
    if (this.station === undefined) {
      return;
    }

    this.saving = true;
    try {
      await this.attachmentService.setStation(this.data.attachment.id, this.station ?? 0);
      this.data.attachment.station = this.station;
      this.toast.saved();
      this.done();
    } finally {
      this.saving = false;
    }
  }

  public done(): void {
    this.dialogRef.close();
  }
}

export interface AttachmentStationDialogData {
  attachment: Attachment;
}
