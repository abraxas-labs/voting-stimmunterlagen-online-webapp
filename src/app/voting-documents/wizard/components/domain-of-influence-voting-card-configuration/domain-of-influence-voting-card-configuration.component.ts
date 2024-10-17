/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardGroup, VotingCardSort } from '@abraxas/voting-stimmunterlagen-proto';
import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { DomainOfInfluenceVotingCardConfiguration } from '../../../../models/domain-of-influence-voting-card-configuration.model';
import { DomainOfInfluenceVotingCardService } from '../../../../services/domain-of-influence-voting-card.service';
import { EnumItemDescription, EnumUtil } from '../../../../services/enum.util';

@Component({
  selector: 'app-domain-of-influence-voting-card-configuration',
  templateUrl: './domain-of-influence-voting-card-configuration.component.html',
  styleUrls: ['./domain-of-influence-voting-card-configuration.component.scss'],
})
export class DomainOfInfluenceVotingCardConfigurationComponent implements AfterViewInit {
  public readonly votingCardGroups: EnumItemDescription<VotingCardGroup>[];
  public groupErrors: boolean[];
  public readonly votingCardSorts: EnumItemDescription<VotingCardSort>[];
  public sortErrors: boolean[];
  private initialized = false;

  public updateSampleCount(sampleCount: number) {
    if (this.votingCardConfiguration.sampleCount === sampleCount) {
      return;
    }

    this.votingCardConfiguration.sampleCount = sampleCount;
    this.emitConfigurationChanged();
  }

  @Input()
  public votingCardConfiguration!: DomainOfInfluenceVotingCardConfiguration;

  @Input()
  public canEdit = false;

  @Output()
  public configurationChanged: EventEmitter<void> = new EventEmitter<void>();

  constructor(private readonly doiVotingCardService: DomainOfInfluenceVotingCardService, enumUtil: EnumUtil) {
    this.votingCardGroups = enumUtil.getArrayWithDescriptions<VotingCardGroup>(VotingCardGroup, 'VOTING_CARD_GROUPS.');
    this.groupErrors = this.votingCardGroups.map(_ => false);

    this.votingCardSorts = enumUtil.getArrayWithDescriptions<VotingCardSort>(VotingCardSort, 'VOTING_CARD_SORTS.');
    this.sortErrors = this.votingCardSorts.map(_ => false);
  }

  public ngAfterViewInit(): void {
    // Prevent save calls triggered by ngModelChange, when setting the initial value
    this.initialized = true;
  }

  public emitConfigurationChanged(): void {
    if (!this.initialized || !this.canEdit || this.groupErrors.some(e => e) || this.sortErrors.some(e => e)) {
      return;
    }

    this.configurationChanged.emit();
  }

  public async groupChanged(group: VotingCardGroup, index: number): Promise<void> {
    this.votingCardConfiguration.votingCardGroups[index] = group;
    this.refreshGroupErrors();
    this.emitConfigurationChanged();
  }

  public addSort(): void {
    this.votingCardConfiguration.votingCardSorts = [
      ...this.votingCardConfiguration.votingCardSorts,
      VotingCardSort.VOTING_CARD_SORT_UNSPECIFIED,
    ];
    this.refreshGroupErrors();
    this.emitConfigurationChanged();
  }

  public addGroup(): void {
    this.votingCardConfiguration.votingCardGroups = [
      ...this.votingCardConfiguration.votingCardGroups,
      VotingCardGroup.VOTING_CARD_GROUP_UNSPECIFIED,
    ];
    this.refreshGroupErrors();
    this.emitConfigurationChanged();
  }

  public removeSort(index: number): void {
    this.votingCardConfiguration.votingCardSorts.splice(index, 1);
    this.refreshGroupErrors();
    this.emitConfigurationChanged();
  }

  public removeGroup(index: number): void {
    this.votingCardConfiguration.votingCardGroups.splice(index, 1);
    this.refreshGroupErrors();
    this.emitConfigurationChanged();
  }

  private refreshGroupErrors(): void {
    this.groupErrors = this.votingCardConfiguration.votingCardGroups.map(
      (g, i) => !g || this.votingCardConfiguration.votingCardGroups.indexOf(g) !== i,
    );
  }

  public async sortChanged(sort: VotingCardSort, index: number): Promise<void> {
    this.votingCardConfiguration.votingCardSorts[index] = sort;
    this.refreshSortErrors();
    this.emitConfigurationChanged();
  }

  private refreshSortErrors(): void {
    this.sortErrors = this.votingCardConfiguration.votingCardSorts.map(
      (s, i) => !s || this.votingCardConfiguration.votingCardSorts.indexOf(s) !== i,
    );
  }
}
