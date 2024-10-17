/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CheckableItem } from '../../../../models/checkable-item.model';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { DomainOfInfluenceVoterLists, VoterList } from '../../../../models/voter-list.model';
import { DialogService } from '../../../../services/dialog.service';
import { flatten, groupBy, groupBySingle, sum } from '../../../../services/utils/array.utils';
import { VoterListService } from '../../../../services/voter-list.service';
import { VoterListUploadEditDialogComponent } from '../../dialogs/voter-list-upload-edit-dialog/voter-list-upload-edit-dialog.component';
import { VoterListSource } from '@abraxas/voting-stimmunterlagen-proto';
import { VoterListElectoralRegisterEditDialogComponent } from '../../dialogs/voter-list-electoral-register-edit-dialog/voter-list-electoral-register-edit-dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { VoterListImportService } from '../../../../services/voter-list-import.service';
import { VoterListImport, newVoterListImport } from '../../../../models/voter-list-import.model';
import { addCheckablePoliticalBusinessesToVoterLists } from '../../../../services/utils/voter-list.utils';
import {
  VoterListImportSelection,
  VoterListImportSelectionDialogComponent,
  VoterListImportSelectionDialogData,
  VoterListImportSelectionDialogResult,
} from '../../dialogs/voter-list-import-selection-dialog/voter-list-import-selection-dialog.component';
import { VoterListImportEditDialogData } from '../../dialogs/voter-list-import-edit-dialog-base/voter-list-import-edit-dialog-base.component';

@Component({
  selector: 'app-voter-list-table',
  templateUrl: './voter-list-table.component.html',
  styleUrls: ['./voter-list-table.component.scss'],
})
export class VoterListTableComponent {
  public readonly voterListSources: typeof VoterListSource = VoterListSource;
  private domainOfInfluenceVoterListsValue!: DomainOfInfluenceVoterLists;

  @Input()
  public canEdit = false;

  public gridTemplateItemsDirectionStyle = '';

  public get domainOfInfluenceVoterLists(): DomainOfInfluenceVoterLists {
    return this.domainOfInfluenceVoterListsValue;
  }

  @Input()
  public set domainOfInfluenceVoterLists(v: DomainOfInfluenceVoterLists) {
    if (v === this.domainOfInfluenceVoterListsValue) {
      return;
    }

    this.domainOfInfluenceVoterListsValue = v;
    this.recalculateNumberOfVotersAndGridStyle();
  }

  @Output()
  public voterListsChange: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private readonly voterListService: VoterListService,
    private readonly dialog: DialogService,
    private readonly voterListImportService: VoterListImportService,
  ) {}

  public async create(source: VoterListSource): Promise<void> {
    const voterListImport = newVoterListImport(source);
    await this.createOrEdit(voterListImport);
  }

  public async edit(): Promise<void> {
    if (!this.canEdit) {
      return;
    }

    const selectedVoterListImportId = await this.selectVoterListImport();
    if (!selectedVoterListImportId) {
      return;
    }

    const voterListImport = await this.voterListImportService.get(selectedVoterListImportId);
    addCheckablePoliticalBusinessesToVoterLists(
      voterListImport.voterLists,
      this.domainOfInfluenceVoterLists.numberOfVoters.map(x => x.politicalBusiness),
    );
    await this.createOrEdit(voterListImport);
  }

  public async updatePoliticalBusinessChecked(
    voterList: VoterList,
    checkablePoliticalBusiness: CheckableItem<PoliticalBusiness>,
    checked: boolean,
  ): Promise<void> {
    if (checkablePoliticalBusiness.checked === checked) {
      return;
    }

    const pbId = checkablePoliticalBusiness.item.id;

    if (checked) {
      await this.voterListService.assignPoliticalBusiness(voterList.id, pbId);
    } else {
      await this.voterListService.unassignPoliticalBusiness(voterList.id, pbId);
    }

    voterList.checkablePoliticalBusinesses.updateChecked(checkablePoliticalBusiness, checked);
    this.recalculateNumberOfVotersAndGridStyle();
  }

  private async createOrEdit(voterListImport: VoterListImport): Promise<void> {
    if (!this.canEdit) {
      return;
    }

    const dialogData: VoterListImportEditDialogData = {
      voterListImport,
      domainOfInfluenceId: this.domainOfInfluenceVoterLists.domainOfInfluence.id,
      politicalBusinesses: this.domainOfInfluenceVoterLists.numberOfVoters.map(n => n.politicalBusiness),
    };

    const dialogType: ComponentType<VoterListUploadEditDialogComponent | VoterListElectoralRegisterEditDialogComponent> =
      voterListImport.source === VoterListSource.VOTER_LIST_SOURCE_MANUAL_ECH_45_UPLOAD
        ? VoterListUploadEditDialogComponent
        : VoterListElectoralRegisterEditDialogComponent;

    const result = await this.dialog.openForResult(dialogType, dialogData);
    if (!result) {
      return;
    }

    voterListImport = result.voterListImport;

    if (result.deleted) {
      this.domainOfInfluenceVoterLists.voterLists = this.domainOfInfluenceVoterLists.voterLists.filter(
        x => x.importId !== voterListImport.id,
      );
      this.recalculateNumberOfVotersAndGridStyle();
      return;
    }

    const existingVoterLists = this.domainOfInfluenceVoterLists.voterLists.filter(vl => vl.importId == voterListImport.id);
    if (existingVoterLists.length === 0) {
      this.domainOfInfluenceVoterLists.voterLists = [...this.domainOfInfluenceVoterLists.voterLists, ...voterListImport.voterLists];
      this.recalculateNumberOfVotersAndGridStyle();
      return;
    }

    this.domainOfInfluenceVoterLists.voterLists = this.domainOfInfluenceVoterLists.voterLists.filter(
      x => x.importId !== voterListImport.id,
    );
    this.domainOfInfluenceVoterLists.voterLists = [...this.domainOfInfluenceVoterLists.voterLists, ...voterListImport.voterLists];
    this.recalculateNumberOfVotersAndGridStyle();
  }

  private recalculateNumberOfVotersAndGridStyle(): void {
    this.gridTemplateItemsDirectionStyle = `repeat(${this.domainOfInfluenceVoterLists.voterLists.length + 1}, 1fr) minmax(5rem, auto)`;

    const numberOfVotersListByPbId = groupBy(
      flatten(
        this.domainOfInfluenceVoterLists.voterLists.map(x =>
          x.checkablePoliticalBusinesses.items.map(cpb => ({ numberOfVoters: cpb.checked ? x.numberOfVoters : 0, pbId: cpb.item.id })),
        ),
      ),
      x => x.pbId,
    );

    for (const [pbId, numberOfVotersList] of Object.entries(numberOfVotersListByPbId)) {
      const pbNumberOfVoters = this.domainOfInfluenceVoterLists.numberOfVoters.find(n => n.politicalBusiness.id === pbId)!;
      pbNumberOfVoters.numberOfVoters = sum(numberOfVotersList, x => x.numberOfVoters);
    }

    this.domainOfInfluenceVoterLists.totalNumberOfVoters = sum(this.domainOfInfluenceVoterLists.voterLists, x => x.numberOfVoters);
    // explicit cd trigger, since cd does not work for single objects in arrays.
    this.domainOfInfluenceVoterLists.numberOfVoters = [...this.domainOfInfluenceVoterLists.numberOfVoters];
    this.voterListsChange.emit();
  }

  private async selectVoterListImport(): Promise<string | undefined> {
    const voterListImports: VoterListImportSelection[] = Object.entries(
      groupBySingle(
        this.domainOfInfluenceVoterLists.voterLists.map(vl => ({
          name: vl.name,
          importId: vl.importId,
        })),
        x => x.importId,
        x => x,
      ),
    ).map(([_, v]) => v);

    if (voterListImports.length === 1) {
      return voterListImports[0].importId;
    }

    const dialogData: VoterListImportSelectionDialogData = {
      voterListImports,
    };

    const dialogResult = await this.dialog.openForResult<VoterListImportSelectionDialogComponent, VoterListImportSelectionDialogResult>(
      VoterListImportSelectionDialogComponent,
      dialogData,
    );
    return dialogResult?.selectedVoterListImportId;
  }
}
