/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Attachment, AttachmentState } from '../../../models/attachment.model';
import { AttachmentService } from '../../../services/attachment.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-attachment-state-dialog',
  templateUrl: './attachment-state-dialog.component.html',
  styleUrls: ['./attachment-state-dialog.component.scss'],
})
export class AttachmentStateDialogComponent {
  public readonly attachmentStates: typeof AttachmentState = AttachmentState;
  public saving = false;
  public comment = '';
  public deleteButtonData!: AttachmentStateButtonData;
  public saveButtonData!: AttachmentStateButtonData;
  public isDefinedState = false;

  constructor(
    private readonly dialogRef: MatDialogRef<AttachmentStateDialogComponent>,
    private readonly attachmentService: AttachmentService,
    private readonly toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentStateDialogData,
  ) {
    switch (data.attachment.state) {
      case AttachmentState.ATTACHMENT_STATE_DEFINED:
        this.deleteButtonData = { label: 'SET_TO_REJECTED', state: AttachmentState.ATTACHMENT_STATE_REJECTED };
        this.saveButtonData = { label: 'SET_TO_DELIVERED', state: AttachmentState.ATTACHMENT_STATE_DELIVERED };
        this.isDefinedState = true;
        break;
      case AttachmentState.ATTACHMENT_STATE_DELIVERED:
        this.deleteButtonData = { label: 'RESET_TO_DEFINED', state: AttachmentState.ATTACHMENT_STATE_DEFINED };
        this.saveButtonData = { label: 'SET_TO_REJECTED', state: AttachmentState.ATTACHMENT_STATE_REJECTED };
        break;
      case AttachmentState.ATTACHMENT_STATE_REJECTED:
        this.deleteButtonData = { label: 'RESET_TO_DEFINED', state: AttachmentState.ATTACHMENT_STATE_DEFINED };
        // set empty instance to prevent undefined error in button bar.
        this.saveButtonData = { label: '', state: AttachmentState.ATTACHMENT_STATE_UNSPECIFIED };
        break;
      default:
        throw new Error('invalid attachment state');
    }
  }

  public async save(state: AttachmentState): Promise<void> {
    this.saving = true;
    try {
      await this.attachmentService.setState(this.data.attachment.id, state, this.comment);

      this.data.attachment.state = state;
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

export interface AttachmentStateDialogData {
  attachment: Attachment;
}

interface AttachmentStateButtonData {
  label: string;
  state: AttachmentState;
}
