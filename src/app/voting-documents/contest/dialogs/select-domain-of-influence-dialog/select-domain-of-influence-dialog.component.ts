/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';

@Component({
  selector: 'app-select-domain-of-influence-dialog',
  templateUrl: './select-domain-of-influence-dialog.component.html',
  styleUrls: ['./select-domain-of-influence-dialog.component.scss'],
})
export class SelectDomainOfInfluenceDialogComponent {
  constructor(
    private readonly dialogRef: MatDialogRef<DomainOfInfluence[], DomainOfInfluence | undefined>,
    @Inject(MAT_DIALOG_DATA) public readonly domainOfInfluences: DomainOfInfluence[],
  ) {}

  public done(doi?: DomainOfInfluence): void {
    this.dialogRef.close(doi);
  }
}
