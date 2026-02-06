/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export type ConfirmColor = 'primary' | 'warn' | undefined;

@Component({
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
  standalone: false,
})
export class ConfirmDialogComponent {
  private readonly dialogRef = inject<MatDialogRef<ConfirmDialogData>>(MatDialogRef);

  public readonly title: string;
  public readonly message: string;
  public readonly confirmText: string;
  public readonly cancelText: string;
  public readonly confirmColor: ConfirmColor;
  public readonly showCancel: boolean;

  constructor() {
    const dialogData = inject<ConfirmDialogData>(MAT_DIALOG_DATA);

    this.title = dialogData.title;
    this.message = dialogData.message;
    this.confirmText = dialogData.confirmText ? dialogData.confirmText : 'APP.OK';
    this.cancelText = dialogData.cancelText ? dialogData.cancelText : 'APP.CANCEL';
    this.confirmColor = dialogData.confirmColor ? dialogData.confirmColor : 'warn';
    this.showCancel = dialogData.showCancel;
  }

  public confirm(): void {
    this.dialogRef.close({ confirmed: true });
  }

  public cancel(): void {
    this.dialogRef.close({ confirmed: false });
  }
}

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel: boolean;
  confirmColor: ConfirmColor;
}

export interface ConfirmDialogResult {
  confirmed: boolean;
}
