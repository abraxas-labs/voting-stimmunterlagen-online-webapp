/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-voter-list-import-selection-dialog',
  templateUrl: './voter-list-import-selection-dialog.component.html',
  styleUrls: ['./voter-list-import-selection-dialog.component.scss'],
  standalone: false,
})
export class VoterListImportSelectionDialogComponent {
  public readonly data = inject<VoterListImportSelectionDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef =
    inject<MatDialogRef<VoterListImportSelectionDialogComponent, VoterListImportSelectionDialogResult>>(MatDialogRef);

  public readonly voterListImports: VoterListImportSelection[];

  constructor() {
    this.voterListImports = this.data.voterListImports;
  }

  public done(voterListImportId: string) {
    const result: VoterListImportSelectionDialogResult = {
      selectedVoterListImportId: voterListImportId,
    };

    return this.dialogRef.close(result);
  }
}

export interface VoterListImportSelectionDialogData {
  voterListImports: VoterListImportSelection[];
}

export interface VoterListImportSelectionDialogResult {
  selectedVoterListImportId?: string;
}

export interface VoterListImportSelection {
  name: string;
  importId: string;
}
