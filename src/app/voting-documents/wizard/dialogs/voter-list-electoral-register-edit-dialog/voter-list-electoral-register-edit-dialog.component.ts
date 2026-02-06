/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ElectoralRegisterService } from '../../../../services/electoral-register.service';
import { ElectoralRegisterFilter, ElectoralRegisterFilterMetadata, ElectoralRegisterFilterVersion } from '../../../../models/filter.model';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER } from '@angular/material/autocomplete';
import { MAT_SELECT_SCROLL_STRATEGY_PROVIDER } from '@angular/material/select';
import { fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { mapVoterListImportResponseToImport } from '../../../../services/utils/voter-list.utils';
import { VoterListImportEditDialogBaseComponent } from '../voter-list-import-edit-dialog-base/voter-list-import-edit-dialog-base.component';

const filterVersionsCount = 3;

@Component({
  selector: 'app-voter-list-electoral-register-edit-dialog',
  templateUrl: './voter-list-electoral-register-edit-dialog.component.html',
  styleUrls: ['./voter-list-electoral-register-edit-dialog.component.scss'],
  providers: [MAT_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, MAT_SELECT_SCROLL_STRATEGY_PROVIDER],
  standalone: false,
})
export class VoterListElectoralRegisterEditDialogComponent
  extends VoterListImportEditDialogBaseComponent<VoterListElectoralRegisterEditDialogComponent>
  implements OnInit
{
  private readonly electoralRegisterService = inject(ElectoralRegisterService);
  private readonly cd = inject(ChangeDetectorRef);

  public selectedFilter?: ElectoralRegisterFilter;
  public selectedFilterVersion?: ElectoralRegisterFilterVersion;
  public filters?: ElectoralRegisterFilter[];
  public filterVersions?: ElectoralRegisterFilterVersion[];
  public createNewVersion: boolean = false;
  public newFilterVersionName: string = '';
  public newFilterVersionDeadline: string = toBcDate(new Date());
  public newFilterVersionMetadata?: ElectoralRegisterFilterMetadata;
  public newFilterVersionMetadataLoading = false;
  public loading = true;

  constructor() {
    super();
  }

  public async ngOnInit(): Promise<void> {
    try {
      const loadSelectedPromise = !!this.voterListImport.sourceId
        ? this.electoralRegisterService.getFilterVersion(this.voterListImport.sourceId)
        : Promise.resolve(undefined);
      const loadFiltersPromise = this.loadFilters();

      const [selected] = await Promise.all([loadSelectedPromise, loadFiltersPromise]);
      if (selected !== undefined && this.filters !== undefined) {
        this.selectedFilter = this.filters.find(f => f.id === selected.filter.id);
        await this.loadFilterVersions();
        await this.loadFilterMetadata();
      }
    } finally {
      this.loading = false;
    }
  }

  public get canSave(): boolean {
    if (this.step === 1) {
      return (
        (!this.createNewVersion && !!this.voterListImport.sourceId) ||
        (this.createNewVersion && !!this.newFilterVersionName && !!this.newFilterVersionDeadline)
      );
    }

    if (this.voterListImportError) {
      return false;
    }

    return this.voterListImport.voterLists.every(vl => vl.checkablePoliticalBusinesses.atLeastOneChecked || this.isPoliticalAssembly);
  }

  public async saveFirstStep(): Promise<void> {
    if (this.createNewVersion) {
      await this.saveWithNewFilterVersion();
      this.toast.saved();
    }
  }

  public async selectFilter(filterName: string): Promise<void> {
    const filter = this.filters?.find(f => f.name === filterName);

    if (this.selectedFilter === filter) {
      return;
    }

    this.selectedFilter = filter;

    // necessary with bc-autocomplete
    this.cd.detectChanges();
    await this.loadFilterVersions();
  }

  public async loadFilterVersions(): Promise<void> {
    delete this.filterVersions;
    delete this.selectedFilterVersion;
    const filterId = this.selectedFilter?.id;
    let allFilterVersions: ElectoralRegisterFilterVersion[] = [];

    if (filterId !== undefined) {
      try {
        allFilterVersions = await this.electoralRegisterService.listFilterVersions(filterId);
      } catch (e) {
        allFilterVersions = [];
      }
    }

    const filterVersions = allFilterVersions.slice(0, filterVersionsCount);
    this.selectedFilterVersion = allFilterVersions.find(fv => fv.id === this.voterListImport.sourceId);

    if (!!this.selectedFilterVersion && !filterVersions.includes(this.selectedFilterVersion)) {
      this.filterVersions = [...filterVersions, this.selectedFilterVersion];
    } else {
      this.filterVersions = filterVersions;
    }

    await this.loadFilterMetadata();
  }

  public setNewFilterVersionName(name: string): void {
    if (this.newFilterVersionName === name) {
      return;
    }

    this.newFilterVersionName = name;
    this.createNewVersion = !!this.newFilterVersionName;
  }

  public async setNewFilterVersionDeadline(deadline: string): Promise<void> {
    if (this.newFilterVersionDeadline === deadline) {
      return;
    }

    this.newFilterVersionDeadline = deadline;
    await this.loadFilterMetadata();
  }

  public async loadFilterMetadata(): Promise<void> {
    delete this.newFilterVersionMetadata;
    if (this.selectedFilter === undefined || !this.newFilterVersionDeadline) {
      return;
    }

    try {
      this.newFilterVersionMetadataLoading = true;
      this.newFilterVersionMetadata = await this.electoralRegisterService.getFilterMetadata(
        this.selectedFilter.id,
        fromBcDate(this.newFilterVersionDeadline)!,
      );
    } catch (e) {
      delete this.newFilterVersionMetadata;
    } finally {
      this.newFilterVersionMetadataLoading = false;
    }
  }

  private async saveWithNewFilterVersion(): Promise<void> {
    if (!this.selectedFilter) {
      return;
    }

    const params = {
      filterId: this.selectedFilter.id,
      filterVersionDeadline: fromBcDate(this.newFilterVersionDeadline)!,
      filterVersionName: this.newFilterVersionName,
    };

    const response = !this.isNew
      ? await this.electoralRegisterService.updateVoterListImportWithNewFilterVersion(this.voterListImport.id, params)
      : await this.electoralRegisterService.createVoterListImportWithNewFilterVersion(this.data.domainOfInfluence.id, params);

    if (response.error) {
      this.voterListImportError = response.error;
      return;
    }

    this.voterListImport.id = response.importId;
    this.voterListImport.sourceId = response.filterVersionId;
    this.voterListImport.name = `${this.selectedFilter.name} / ${this.newFilterVersionName}`;
    this.voterListImport.lastUpdate = new Date();
    this.voterListImport.autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit = true;
    mapVoterListImportResponseToImport(this.voterListImport, response.voterLists, this.politicalBusinesses, this.isNew);
  }

  private async loadFilters(): Promise<void> {
    try {
      this.filters = await this.electoralRegisterService.listFilters();
    } catch (e) {
      this.filters = [];
    }
  }
}
