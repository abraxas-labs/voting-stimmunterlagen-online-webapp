/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Directive, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../../services/toast.service';
import { VoterListService } from '../../../../services/voter-list.service';
import { VoterListImport } from '../../../../models/voter-list-import.model';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { VoterListImportService } from '../../../../services/voter-list-import.service';
import { VoterList } from '../../../../models/voter-list.model';
import { cloneDeep } from 'lodash';

@Directive()
export abstract class VoterListImportEditDialogBaseComponent<TDialogComponent> {
  public readonly isNew: boolean = false;
  public readonly voterListImport: VoterListImport;
  public readonly politicalBusinesses: PoliticalBusiness[];
  public deleting = false;
  public persistedVoterLists?: VoterList[];
  public step = 1;
  public saving = false;

  protected constructor(
    protected readonly dialogRef: MatDialogRef<TDialogComponent, VoterListImportEditDialogResult>,
    protected readonly toast: ToastService,
    protected readonly voterListService: VoterListService,
    protected readonly voterListImportService: VoterListImportService,
    @Inject(MAT_DIALOG_DATA) protected data: VoterListImportEditDialogData,
  ) {
    this.isNew = !data.voterListImport.id;
    this.voterListImport = data.voterListImport;
    this.politicalBusinesses = data.politicalBusinesses;
  }

  public abstract saveFirstStep(): Promise<void>;

  public async save(): Promise<void> {
    this.saving = true;

    if (this.step === 1) {
      try {
        await this.saveFirstStep();
        this.persistedVoterLists = this.voterListImport.voterLists.map(vl => cloneDeep(vl));
        this.step = 2;
      } finally {
        this.saving = false;
      }
      return;
    }

    try {
      await this.voterListService.updateLists(this.voterListImport.voterLists);
      this.toast.saved();
      this.done();
    } finally {
      this.saving = false;
    }
  }

  public async delete(): Promise<void> {
    this.deleting = true;
    try {
      await this.voterListImportService.delete(this.voterListImport.id);
      this.toast.deleted();
      this.done(true);
    } finally {
      this.deleting = false;
    }
  }

  public cancel(): void {
    if (this.step === 1) {
      this.dialogRef.close();
      return;
    }

    this.voterListImport.voterLists = this.persistedVoterLists!;
    this.done();
  }

  public done(deleted?: boolean): void {
    this.dialogRef.close({
      voterListImport: this.voterListImport,
      deleted,
    });
  }
}

export interface VoterListImportEditDialogData {
  voterListImport: VoterListImport;
  domainOfInfluenceId: string;
  politicalBusinesses: PoliticalBusiness[];
}

export interface VoterListImportEditDialogResult {
  voterListImport: VoterListImport;
  deleted?: boolean;
}
