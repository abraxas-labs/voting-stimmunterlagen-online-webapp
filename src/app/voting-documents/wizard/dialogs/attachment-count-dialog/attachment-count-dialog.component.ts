/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attachment } from '../../../../models/attachment.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-attachment-count-dialog',
  templateUrl: './attachment-count-dialog.component.html',
  styleUrls: ['./attachment-count-dialog.component.scss'],
  standalone: false,
})
export class AttachmentCountDialogComponent {
  public readonly data = inject<AttachmentCountDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<AttachmentCountDialogComponent>>(MatDialogRef);
  private readonly attachmentService = inject(AttachmentService);
  private readonly toast = inject(ToastService);

  public saving = false;
  public count?: number;

  constructor() {
    this.count = this.data.attachment.domainOfInfluenceAttachmentRequiredCount;
  }

  public async save(): Promise<void> {
    if (this.count === undefined) {
      return;
    }

    this.saving = true;
    try {
      await this.attachmentService.setDomainOfInfluenceAttachmentRequiredCount(
        this.data.attachment.id,
        this.data.domainOfInfluenceId,
        this.count,
      );
      this.data.attachment.domainOfInfluenceAttachmentRequiredCount = this.count;
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

export interface AttachmentCountDialogData {
  attachment: Attachment;
  domainOfInfluenceId: string;
}
