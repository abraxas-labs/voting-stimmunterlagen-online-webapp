/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintJob, PrintJobState } from '../../../../models/print-job.model';

@Component({
  selector: 'app-contest-overview-print-job-table',
  templateUrl: './contest-overview-print-job-table.component.html',
  styleUrls: ['./contest-overview-print-job-table.component.scss'],
})
export class ContestOverviewPrintJobTableComponent {
  public readonly printJobStates: typeof PrintJobState = PrintJobState;

  public readonly columns = [
    'authority',
    'domainOfInfluence',
    'hasCommunalPoliticalBusinesses',
    'attachmentsDefinedCount',
    'attachmentsDeliveredCount',
    'templateName',
    'shippingAway',
    'lastConfirmedStep',
    'generateVotingCardsTriggered',
    'processedOn',
    'doneOn',
    'state',
  ];

  @Input()
  public printJobs: PrintJob[] = [];

  @Input()
  public forPrintJobManagement = false;

  constructor(private readonly router: Router, private readonly route: ActivatedRoute) {}

  public async openDetail(printJob: PrintJob): Promise<void> {
    const route = this.forPrintJobManagement
      ? ['print-job', printJob.domainOfInfluence.id]
      : ['../', 'print-job', printJob.domainOfInfluence.id];
    await this.router.navigate(route, { relativeTo: this.route });
  }

  public isSelectionDisabled = (row: PrintJob): boolean => {
    return row.state < this.printJobStates.PRINT_JOB_STATE_READY_FOR_PROCESS;
  };
}
