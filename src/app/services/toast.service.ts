/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@abraxas/voting-lib';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(
    private readonly snackbarService: SnackbarService,
    private readonly i18n: TranslateService,
  ) {}

  public success(message: string): void {
    this.snackbarService.success(this.i18n.instant(message));
  }

  public saved(): void {
    this.success('APP.SAVED');
  }

  public deleted(): void {
    this.success('APP.DELETED');
  }

  public error(title: string, message: string): void {
    this.snackbarService.error(`${title}: ${message}`);
  }
}
