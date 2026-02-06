/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Directive, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastService } from '../../../../services/toast.service';
import { VoterListService } from '../../../../services/voter-list.service';
import { VoterListImport, VoterListImportError } from '../../../../models/voter-list-import.model';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { VoterListImportService } from '../../../../services/voter-list-import.service';
import { VoterList } from '../../../../models/voter-list.model';
import { cloneDeep } from 'lodash';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';

@Directive()
export abstract class VoterListImportEditDialogBaseComponent<TDialogComponent> {
  protected readonly dialogRef = inject<MatDialogRef<TDialogComponent, VoterListImportEditDialogResult>>(MatDialogRef);
  protected readonly toast = inject(ToastService);
  protected readonly voterListService = inject(VoterListService);
  protected readonly voterListImportService = inject(VoterListImportService);
  protected readonly data = inject<VoterListImportEditDialogData>(MAT_DIALOG_DATA);

  public readonly isNew: boolean = false;
  public readonly voterListImport: VoterListImport;
  public readonly politicalBusinesses: PoliticalBusiness[];
  public readonly isPoliticalAssembly: boolean = false;
  public voterListImportError?: VoterListImportError;
  public deleting = false;
  public persistedVoterLists?: VoterList[];
  public step = 1;
  public saving = false;

  protected constructor() {
    this.isNew = !this.data.voterListImport.id;
    this.voterListImport = this.data.voterListImport;
    this.politicalBusinesses = this.data.politicalBusinesses;
    this.isPoliticalAssembly = this.data.isPoliticalAssembly;
  }

  public abstract saveFirstStep(): Promise<void>;

  public async save(): Promise<void> {
    this.saving = true;

    if (this.step === 1) {
      try {
        await this.saveFirstStep();

        if (!this.voterListImportError) {
          this.persistedVoterLists = this.voterListImport.voterLists.map(vl => cloneDeep(vl));
        }

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

    if (!this.voterListImportError) {
      this.voterListImport.voterLists = this.persistedVoterLists!;
    }

    this.done();
  }

  public done(deleted?: boolean): void {
    this.dialogRef.close({
      voterListImport: this.voterListImport,
      deleted,
      voterListImportError: this.voterListImportError,
    });
  }
}

export interface VoterListImportEditDialogData {
  voterListImport: VoterListImport;
  domainOfInfluence: DomainOfInfluence;
  politicalBusinesses: PoliticalBusiness[];
  isPoliticalAssembly: boolean;
}

export interface VoterListImportEditDialogResult {
  voterListImport: VoterListImport;
  deleted?: boolean;
  voterListImportError?: VoterListImportError;
}
