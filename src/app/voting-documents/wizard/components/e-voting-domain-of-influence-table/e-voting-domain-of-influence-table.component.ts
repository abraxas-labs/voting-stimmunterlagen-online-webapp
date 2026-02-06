/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, AfterViewInit, Input, ViewChild, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EVotingDomainOfInfluenceEntry } from '../../../../models/e-voting-domain-of-influence.model';
import { Filter, FilterDirective, Sort, SortDirective, TableDataSource, TableExportFormat } from '@abraxas/base-components';

@Component({
  selector: 'app-e-voting-domain-of-influence-table',
  templateUrl: './e-voting-domain-of-influence-table.component.html',
  styleUrls: ['./e-voting-domain-of-influence-table.component.scss'],
  standalone: false,
})
export class EVotingDomainOfInfluenceTableComponent implements AfterViewInit {
  private readonly translate = inject(TranslateService);

  @Input()
  public set eVotingEntries(entries: EVotingDomainOfInfluenceEntry[]) {
    let totalReadiness = true;
    let totalParentPoliticalBusinessCount = 0;
    let totalOwnPoliticalBusinessCount = 0;
    let totalCountOfVotingCardsForEVoters = 0;

    let mappedEntries = entries.map(entry => {
      if (!entry[TableColumn.EVOTING_READY]) {
        totalReadiness = false;
      }

      totalParentPoliticalBusinessCount += entry[TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT];
      totalOwnPoliticalBusinessCount += entry[TableColumn.OWN_POLITICAL_BUSINESSES_COUNT];
      totalCountOfVotingCardsForEVoters += entry[TableColumn.COUNT_OF_VOTING_CARDS_FOR_E_VOTERS];

      return this.mapTableRow(entry);
    });

    this.dataSource.data = [
      this.createTableRow(
        totalReadiness,
        this.translate.instant('STEP_E_VOTING.TOTAL_NUMBER_OF_EVOTERS'),
        '',
        totalParentPoliticalBusinessCount,
        totalOwnPoliticalBusinessCount,
        totalCountOfVotingCardsForEVoters,
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
    TableColumn.BFS,
    TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT,
    TableColumn.OWN_POLITICAL_BUSINESSES_COUNT,
    TableColumn.COUNT_OF_VOTING_CARDS_FOR_E_VOTERS,
  ];

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

  public export(): void {
    this.dataSource.export(
      this.translate.instant('E_VOTING.EXPORT_DOMAIN_OF_INFLUENCE.EXPORT_FILENAME'),
      TableExportFormat.CSV,
      columnName => {
        if (columnName === TableColumn.NAME) {
          return this.translate.instant('E_VOTING.EXPORT_DOMAIN_OF_INFLUENCE.NAME');
        }
        if (columnName === TableColumn.BFS) {
          return this.translate.instant('E_VOTING.DOMAIN_OF_INFLUENCE.BFS');
        }
        if (columnName === TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT) {
          return this.translate.instant('E_VOTING.DOMAIN_OF_INFLUENCE.PARENT_POLITICAL_BUSINESSES_COUNT');
        }
        if (columnName === TableColumn.OWN_POLITICAL_BUSINESSES_COUNT) {
          return this.translate.instant('E_VOTING.DOMAIN_OF_INFLUENCE.OWN_POLITICAL_BUSINESSES_COUNT');
        }
        if (columnName === TableColumn.COUNT_OF_VOTING_CARDS_FOR_E_VOTERS) {
          return this.translate.instant('E_VOTING.DOMAIN_OF_INFLUENCE.COUNT_OF_VOTING_CARDS_FOR_E_VOTERS');
        }
        return null;
      },
    );
  }

  private mapTableRow(eVotingEntry: EVotingDomainOfInfluenceEntry): TableRow {
    return this.createTableRow(
      eVotingEntry.eVotingReady,
      eVotingEntry.domainOfInfluence.name,
      eVotingEntry.domainOfInfluence.bfs,
      eVotingEntry.parentPoliticalBusinessesCount,
      eVotingEntry.ownPoliticalBusinessesCount,
      eVotingEntry.countOfVotingCardsForEVoters,
    );
  }

  private createTableRow(
    eVotingReady: boolean,
    name: string,
    bfs: string,
    parentPoliticalBusinessesCount: number,
    ownPoliticalBusinessesCount: number,
    numberOfEVoters: number,
  ): TableRow {
    return {
      [TableColumn.EVOTING_READY]: eVotingReady,
      [TableColumn.NAME]: name,
      [TableColumn.BFS]: bfs,
      [TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT]: parentPoliticalBusinessesCount,
      [TableColumn.OWN_POLITICAL_BUSINESSES_COUNT]: ownPoliticalBusinessesCount,
      [TableColumn.COUNT_OF_VOTING_CARDS_FOR_E_VOTERS]: numberOfEVoters,
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
  BFS = 'bfs',
  PARENT_POLITICAL_BUSINESSES_COUNT = 'parentPoliticalBusinessesCount',
  OWN_POLITICAL_BUSINESSES_COUNT = 'ownPoliticalBusinessesCount',
  COUNT_OF_VOTING_CARDS_FOR_E_VOTERS = 'countOfVotingCardsForEVoters',
}

export interface TableRow {
  [TableColumn.EVOTING_READY]: boolean;
  [TableColumn.NAME]: string;
  [TableColumn.BFS]: string;
  [TableColumn.PARENT_POLITICAL_BUSINESSES_COUNT]: number;
  [TableColumn.OWN_POLITICAL_BUSINESSES_COUNT]: number;
  [TableColumn.COUNT_OF_VOTING_CARDS_FOR_E_VOTERS]: number;
  isHidden: boolean;
}
