/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { mapVoterListImportResponseToImport } from '../../../../services/utils/voter-list.utils';
import { VoterListImportEditDialogBaseComponent } from '../voter-list-import-edit-dialog-base/voter-list-import-edit-dialog-base.component';

@Component({
  selector: 'app-voter-list-upload-edit-dialog',
  templateUrl: './voter-list-upload-edit-dialog.component.html',
  styleUrls: ['./voter-list-upload-edit-dialog.component.scss'],
  standalone: false,
})
export class VoterListUploadEditDialogComponent extends VoterListImportEditDialogBaseComponent<VoterListUploadEditDialogComponent> {
  public file?: File;
  public lastUpdate: string;
  public validLastUpdate = false;
  public readonly maxUploadFileSize: number = 1024 * 1024 * 1024; // 1GB

  constructor() {
    super();
    this.lastUpdate = toBcDate(this.voterListImport.lastUpdate);
    this.updateValidLastUpdate();
  }

  public get canSave(): boolean {
    if (this.step === 1) {
      return !!this.voterListImport.name && this.validLastUpdate && (!this.isNew || !!this.file);
    }

    if (this.voterListImportError) {
      return false;
    }

    return this.voterListImport.voterLists.every(vl => vl.checkablePoliticalBusinesses.atLeastOneChecked || this.isPoliticalAssembly);
  }

  public async saveFirstStep(): Promise<void> {
    this.voterListImport.lastUpdate = fromBcDate(this.lastUpdate)!;

    const response = this.isNew
      ? await this.voterListImportService.create(this.voterListImport, this.data.domainOfInfluence.id, this.file!)
      : await this.voterListImportService.update(this.voterListImport, this.file);

    if (response.error) {
      this.voterListImportError = response.error;
      return;
    }

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
