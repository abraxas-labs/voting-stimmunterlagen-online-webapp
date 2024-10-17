/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, AfterViewInit, Input, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EVotingDomainOfInfluenceEntry } from '../../../../models/e-voting-domain-of-influence.model';
import { Filter, FilterDirective, Sort, SortDirective, TableDataSource } from '@abraxas/base-components';

@Component({
  selector: 'app-e-voting-domain-of-influence-table',
  templateUrl: './e-voting-domain-of-influence-table.component.html',
  styleUrls: ['./e-voting-domain-of-influence-table.component.scss'],
})
export class EVotingDomainOfInfluenceTableComponent implements AfterViewInit {
  @Input()
  public set eVotingEntries(entries: EVotingDomainOfInfluenceEntry[]) {
    let totalReadiness = true;
    let totalParentPoliticalBusinessCount = 0;
    let totalOwnPoliticalBusinessCount = 0;
    let totalNumberOfEvoters = 0;

    let mappedEntries = entries.map(entry => {
      if (!entry[TableColumn.EVOTING_READY]) {
        totalReadiness = false;
      }

      totalParentPoliticalBusinessCount += entry[TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT];
      totalOwnPoliticalBusinessCount += entry[TableColumn.OWN_POLITICAL_BUSINESSES_COUNT];
      totalNumberOfEvoters += entry[TableColumn.NUMBER_OF_EVOTERS];

      return this.mapTableRow(entry);
    });

    this.dataSource.data = [
      this.createTableRow(
        totalReadiness,
        this.translate.instant('STEP_E_VOTING.TOTAL_NUMBER_OF_EVOTERS'),
        totalParentPoliticalBusinessCount,
        totalOwnPoliticalBusinessCount,
        totalNumberOfEvoters,
      ),
      ...mappedEntries,
    ];
  }

  @ViewChild(FilterDirective, { static: true })
  public filter!: FilterDirective;

  @ViewChild(SortDirective, { static: true })
  public sort!: SortDirective;

  public dataSource = new TableDataSource<TableRow>();
  public isFilteringActive = false;
  public isSortingActive = false;
  public columns = TableColumn;
  public columnsToDisplay: string[] = [
    TableColumn.EVOTING_READY,
    TableColumn.NAME,
    TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT,
    TableColumn.OWN_POLITICAL_BUSINESSES_COUNT,
    TableColumn.NUMBER_OF_EVOTERS,
  ];

  constructor(private readonly translate: TranslateService) {}

  public ngAfterViewInit(): void {
    this.dataSource.filter = this.filter;
    this.dataSource.sort = this.sort;
  }

  public onFilterChange(active: Filter[]): void {
    this.isFilteringActive = active.length !== 0;
    this.hideOrShowTotalRow();
  }

  public onSortChange(active: Sort[]): void {
    this.isSortingActive = active.length !== 0;
    this.hideOrShowTotalRow();
  }

  private mapTableRow(eVotingEntry: EVotingDomainOfInfluenceEntry): TableRow {
    return this.createTableRow(
      eVotingEntry.eVotingReady,
      eVotingEntry.domainOfInfluence.name,
      eVotingEntry.parentPoliticalBusinessesCount,
      eVotingEntry.ownPoliticalBusinessesCount,
      eVotingEntry.numberOfEVoters,
    );
  }

  private createTableRow(
    eVotingReady: boolean,
    name: string,
    parentPoliticalBusinessesCount: number,
    ownPoliticalBusinessesCount: number,
    numberOfEVoters: number,
  ): TableRow {
    return {
      [TableColumn.EVOTING_READY]: eVotingReady,
      [TableColumn.NAME]: name,
      [TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT]: parentPoliticalBusinessesCount,
      [TableColumn.OWN_POLITICAL_BUSINESSES_COUNT]: ownPoliticalBusinessesCount,
      [TableColumn.NUMBER_OF_EVOTERS]: numberOfEVoters,
      isHidden: false,
    };
  }

  private hideOrShowTotalRow(): void {
    this.dataSource.data[0]!.isHidden = this.isFilteringActive || this.isSortingActive;
  }
}

export enum TableColumn {
  EVOTING_READY = 'eVotingReady',
  NAME = 'name',
  PARENT_POLITICAL_BUSINESSES_COUNT = 'parentPoliticalBusinessesCount',
  OWN_POLITICAL_BUSINESSES_COUNT = 'ownPoliticalBusinessesCount',
  NUMBER_OF_EVOTERS = 'numberOfEVoters',
}

export interface TableRow {
  [TableColumn.EVOTING_READY]: boolean;
  [TableColumn.NAME]: string;
  [TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT]: number;
  [TableColumn.OWN_POLITICAL_BUSINESSES_COUNT]: number;
  [TableColumn.NUMBER_OF_EVOTERS]: number;
  isHidden: boolean;
}
