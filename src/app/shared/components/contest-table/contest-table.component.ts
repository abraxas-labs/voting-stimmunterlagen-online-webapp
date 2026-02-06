/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, AfterViewInit, OnInit, inject } from '@angular/core';
import { FilterDirective, Sort, SortDirective, TableDataSource } from '@abraxas/base-components';
import { Contest } from '../../../models/contest.model';
import { PrintJobState } from '@abraxas/voting-stimmunterlagen-proto';
import { TranslateService } from '@ngx-translate/core';
import { EnumItemDescription, EnumUtil } from '../../../services/enum.util';

@Component({
  selector: 'app-contest-table',
  templateUrl: './contest-table.component.html',
  styleUrls: ['./contest-table.component.scss'],
  standalone: false,
})
export class ContestTableComponent implements OnChanges, AfterViewInit, OnInit {
  private readonly i18n = inject(TranslateService);
  private enumUtil = inject(EnumUtil);

  public tableColums = TableColumn;
  public contestType: EnumItemDescription<boolean>[] = [];
  public printJobStateItems: EnumItemDescription<PrintJobState>[] = [];
  private readonly defaultColumns = [
    this.tableColums.DATE,
    this.tableColums.TYPE,
    this.tableColums.DOMAIN_OF_INFLUENCE,
    this.tableColums.PRINTING_CENTER_DEADLINE,
    this.tableColums.GENERATE_DEADLINE,
    this.tableColums.ATTACHEMENT_DELIVERY_DEADLINE,
  ];

  public columns = [...this.defaultColumns];
  public dataSource = new TableDataSource<TableRow>();

  @Input()
  public set tableData(contests: Contest[]) {
    this.dataSource.data = contests.map(contest => {
      return this.createTableRow(contest);
    });
  }

  @Input()
  public displayDomainOfInfluenceDetails = false;

  @Input()
  public defaultSorting: Sort[] = [{ id: this.tableColums.DATE, direction: 'desc' }];

  @ViewChild(SortDirective, { static: true })
  public sort!: SortDirective;

  @ViewChild(FilterDirective, { static: true })
  public filter!: FilterDirective;

  @Output()
  public readonly openDetail: EventEmitter<TableRow> = new EventEmitter<TableRow>();

  public async ngOnInit(): Promise<void> {
    this.printJobStateItems = this.enumUtil.getArrayWithDescriptions<PrintJobState>(PrintJobState, 'PRINT_JOB.FILTER_STATES.');
    this.contestType = [
      {
        description: this.i18n.instant('CONTEST.TYPE.CONTEST'),
        value: false,
      },
      {
        description: this.i18n.instant('CONTEST.TYPE.POLITICAL_ASSEMBLY'),
        value: true,
      },
    ];
  }

  public ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filter;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.displayDomainOfInfluenceDetails) {
      return;
    }
    this.onDisplayDomainOfInfluenceDetailsChange();
  }

  private onDisplayDomainOfInfluenceDetailsChange(): void {
    this.columns = [...this.defaultColumns];

    if (this.displayDomainOfInfluenceDetails) {
      this.columns.splice(2, 0, this.tableColums.AUTHORITY);
      this.columns.splice(4, 1, this.tableColums.POST_DEADLINE);
      this.columns.splice(7, 0, this.tableColums.PRINT_JOB_STATE);
    }
  }
  private createTableRow(contest: Contest): TableRow {
    return {
      [TableColumn.CONTEST_ID]: contest.id,
      [TableColumn.DOI_ID]: contest.domainOfInfluence.id,
      [TableColumn.DATE]: contest.date,
      [TableColumn.TYPE]: contest.isPoliticalAssembly,
      [TableColumn.DOMAIN_OF_INFLUENCE]: contest.domainOfInfluence.name,
      [TableColumn.AUTHORITY]: contest.domainOfInfluence.authorityName,
      [TableColumn.POST_DEADLINE]: contest.deliveryToPostDeadlineDate,
      [TableColumn.PRINTING_CENTER_DEADLINE]: contest.printingCenterSignUpDeadlineDate,
      [TableColumn.GENERATE_DEADLINE]: contest.generateVotingCardsDeadlineDate,
      [TableColumn.ATTACHEMENT_DELIVERY_DEADLINE]: contest.attachmentDeliveryDeadlineDate,
      [TableColumn.PRINT_JOB_STATE]: contest.lowestPrintJobsState,
    };
  }
}

export enum TableColumn {
  CONTEST_ID = 'contestId',
  DOI_ID = 'domainOfInfluenceId',
  DATE = 'date',
  TYPE = 'type',
  DOMAIN_OF_INFLUENCE = 'domainOfInfluence',
  AUTHORITY = 'authority',
  POST_DEADLINE = 'postDeadline',
  PRINTING_CENTER_DEADLINE = 'printingCenterSignupDeadline',
  GENERATE_DEADLINE = 'generateVotingCardsDeadline',
  ATTACHEMENT_DELIVERY_DEADLINE = 'attachmentDeliveryDeadline',
  PRINT_JOB_STATE = 'printJobState',
}

export interface TableRow {
  [TableColumn.CONTEST_ID]: string;
  [TableColumn.DOI_ID]: string;
  [TableColumn.DATE]: Date;
  [TableColumn.TYPE]: boolean;
  [TableColumn.DOMAIN_OF_INFLUENCE]: string;
  [TableColumn.AUTHORITY]: string;
  [TableColumn.POST_DEADLINE]: Date | undefined;
  [TableColumn.PRINTING_CENTER_DEADLINE]: Date | undefined;
  [TableColumn.GENERATE_DEADLINE]: Date | undefined;
  [TableColumn.ATTACHEMENT_DELIVERY_DEADLINE]: Date | undefined;
  [TableColumn.PRINT_JOB_STATE]: PrintJobState;
}
