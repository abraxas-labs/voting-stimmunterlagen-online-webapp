/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
  ConfirmDialogResult,
} from '../shared/components/confirm-dialog/confirm-dialog.component';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  public open<T>(component: ComponentType<T>, data: any, additionalParams: any = {}): MatDialogRef<T> {
    return this.dialog.open(component, { data, maxHeight: '90vh', ...additionalParams });
  }

  public async openForResult<T, R = any>(
    component: ComponentType<T>,
    data: any,
    additionalParams: MatDialogConfig = {},
  ): Promise<R | undefined> {
    const dialogRef = this.open(component, data, additionalParams);
    const result = await firstValueFrom(dialogRef.afterClosed());
    return result as R;
  }

  public async confirm(title: string, message: string, confirmText?: string, cancelText?: string): Promise<boolean> {
    const data: ConfirmDialogData = { title, message, confirmText, cancelText, showCancel: true };
    const result = await this.openForResult<ConfirmDialogComponent, ConfirmDialogResult | undefined>(ConfirmDialogComponent, data);
    return result?.confirmed ?? false;
  }
}
