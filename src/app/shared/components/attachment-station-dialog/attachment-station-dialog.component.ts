/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attachment, AttachmentCategory } from '../../../models/attachment.model';
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
  public reservedStations: number[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<AttachmentStationDialogComponent>,
    private readonly attachmentService: AttachmentService,
    private readonly toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentStationDialogData,
  ) {
    this.station = data.attachment.station;

    if (this.isCommunalAttachment(data.attachment)) {
      this.reservedStations = data.otherDomainOfInfluenceAttachments.filter(a => this.isCommunalAttachment(a)).map(a => a.station!);
    }
  }

  public get isReservedStation(): boolean {
    if (this.station === undefined) {
      return false;
    }

    return this.reservedStations.includes(this.station);
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

  private isCommunalAttachment(attachment: Attachment) {
    return (
      attachment.category === AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_MU ||
      attachment.category === AttachmentCategory.ATTACHMENT_CATEGORY_BROCHURE_MU ||
      attachment.category === AttachmentCategory.ATTACHMENT_CATEGORY_OTHER_MU ||
      attachment.category === AttachmentCategory.ATTACHMENT_CATEGORY_VOTING_GUIDE_MU
    );
  }
}

export interface AttachmentStationDialogData {
  attachment: Attachment;
  otherDomainOfInfluenceAttachments: Attachment[];
}
