/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableItem } from '../../../models/translatable-item.model';

@Component({
  selector: 'app-select-role-dialog',
  templateUrl: './select-role-dialog.component.html',
  styleUrls: ['./select-role-dialog.component.scss'],
})
export class SelectRoleDialogComponent implements OnInit {
  public roleItems: TranslatableItem<string>[] = [];

  constructor(
    private readonly dialogRef: MatDialogRef<string[], string>,
    private readonly i18n: TranslateService,
    @Inject(MAT_DIALOG_DATA) public readonly roles: string[],
  ) {}

  public ngOnInit(): void {
    this.roleItems = this.roles.map(r => ({
      label: this.i18n.instant('ROLE.TYPE.' + r),
      value: r,
    }));
  }

  public done(role: string) {
    return this.dialogRef.close(role);
  }
}
