/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { TranslatableItem } from '../../../models/translatable-item.model';

@Component({
  selector: 'app-select-role-dialog',
  templateUrl: './select-role-dialog.component.html',
  styleUrls: ['./select-role-dialog.component.scss'],
  standalone: false,
})
export class SelectRoleDialogComponent implements OnInit {
  public readonly roles: string[] = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<string[], string>>(MatDialogRef);
  private readonly i18n = inject(TranslateService);

  public roleItems: TranslatableItem<string>[] = [];

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
