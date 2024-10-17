/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { ToastService } from '../../../../services/toast.service';
import { VoterListImportService } from '../../../../services/voter-list-import.service';
import { VoterListService } from '../../../../services/voter-list.service';
import { mapVoterListImportResponseToImport } from '../../../../services/utils/voter-list.utils';
import {
  VoterListImportEditDialogBaseComponent,
  VoterListImportEditDialogData,
  VoterListImportEditDialogResult,
} from '../voter-list-import-edit-dialog-base/voter-list-import-edit-dialog-base.component';

@Component({
  selector: 'app-voter-list-upload-edit-dialog',
  templateUrl: './voter-list-upload-edit-dialog.component.html',
  styleUrls: ['./voter-list-upload-edit-dialog.component.scss'],
})
export class VoterListUploadEditDialogComponent extends VoterListImportEditDialogBaseComponent<VoterListUploadEditDialogComponent> {
  public file?: File;
  public lastUpdate: string;
  public validLastUpdate = false;

  constructor(
    dialogRef: MatDialogRef<VoterListUploadEditDialogComponent, VoterListImportEditDialogResult>,
    voterListImportService: VoterListImportService,
    voterListService: VoterListService,
    toast: ToastService,
    @Inject(MAT_DIALOG_DATA) data: VoterListImportEditDialogData,
  ) {
    super(dialogRef, toast, voterListService, voterListImportService, data);
    this.lastUpdate = toBcDate(this.voterListImport.lastUpdate);
    this.updateValidLastUpdate();
  }

  public async saveFirstStep(): Promise<void> {
    this.voterListImport.lastUpdate = fromBcDate(this.lastUpdate)!;

    const response = this.isNew
      ? await this.voterListImportService.create(this.voterListImport, this.data.domainOfInfluenceId, this.file!)
      : await this.voterListImportService.update(this.voterListImport, this.file);

    if (!!this.file) {
      this.voterListImport.id = response.importId;
      this.voterListImport.autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit =
        response.autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit;
      mapVoterListImportResponseToImport(this.voterListImport, response.voterLists, this.politicalBusinesses, this.isNew);
    } else {
      for (let voterList of this.voterListImport.voterLists) {
        voterList.lastUpdate = this.voterListImport.lastUpdate;
        voterList.name = this.voterListImport.name;
      }
    }

    this.toast.saved();
  }

  public updateLastUpdate(e: string): void {
    this.lastUpdate = e;
    this.updateValidLastUpdate();
  }

  public updateValidLastUpdate(): void {
    const lastUpdate = fromBcDate(this.lastUpdate);
    this.validLastUpdate = !!lastUpdate && lastUpdate < new Date();
  }
}
