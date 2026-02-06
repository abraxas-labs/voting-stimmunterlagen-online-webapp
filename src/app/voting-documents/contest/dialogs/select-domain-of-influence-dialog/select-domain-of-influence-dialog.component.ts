/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';

@Component({
  selector: 'app-select-domain-of-influence-dialog',
  templateUrl: './select-domain-of-influence-dialog.component.html',
  styleUrls: ['./select-domain-of-influence-dialog.component.scss'],
  standalone: false,
})
export class SelectDomainOfInfluenceDialogComponent {
  public readonly domainOfInfluences = inject(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<DomainOfInfluence[], DomainOfInfluence | undefined>>(MatDialogRef);

  public done(doi?: DomainOfInfluence): void {
    this.dialogRef.close(doi);
  }
}
