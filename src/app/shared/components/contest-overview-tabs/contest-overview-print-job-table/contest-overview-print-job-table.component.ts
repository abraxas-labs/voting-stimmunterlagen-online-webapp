/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrintJob, PrintJobState } from '../../../../models/print-job.model';

@Component({
  selector: 'app-contest-overview-print-job-table',
  templateUrl: './contest-overview-print-job-table.component.html',
  styleUrls: ['./contest-overview-print-job-table.component.scss'],
  standalone: false,
})
export class ContestOverviewPrintJobTableComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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

  public async openDetail(printJob: PrintJob): Promise<void> {
    if (this.isSelectionDisabled(printJob)) {
      return;
    }

    const route = this.forPrintJobManagement
      ? ['print-job', printJob.domainOfInfluence.id]
      : ['../', 'print-job', printJob.domainOfInfluence.id];
    await this.router.navigate(route, { relativeTo: this.route });
  }

  public isSelectionDisabled = (row: PrintJob): boolean => {
    return row.state < this.printJobStates.PRINT_JOB_STATE_READY_FOR_PROCESS;
  };
}
