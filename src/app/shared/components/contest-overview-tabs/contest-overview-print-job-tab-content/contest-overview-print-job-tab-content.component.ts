/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnInit } from '@angular/core';
import { Contest } from '../../../../models/contest.model';
import { PrintJob, PrintJobState } from '../../../../models/print-job.model';
import { DialogService } from '../../../../services/dialog.service';
import { PrintJobService } from '../../../../services/print-job.service';
import {
  ContestPrintingCenterSignUpDeadlineDialogComponent,
  ContestPrintingCenterSignUpDeadlineDialogData,
  ContestPrintingCenterSignUpDeadlineDialogResult,
} from '../../contest-printing-center-sign-up-deadline-dialog/contest-printing-center-sign-up-deadline-dialog.component';
import { PrintJobFilter } from '../../print-job-filter/print-job-filter.component';

@Component({
  selector: 'app-contest-overview-print-job-tab-content',
  templateUrl: './contest-overview-print-job-tab-content.component.html',
  styleUrls: ['./contest-overview-print-job-tab-content.component.scss'],
})
export class ContestOverviewPrintJobTabContentComponent implements OnInit {
  public loading = true;
  public printJobs: PrintJob[] = [];

  @Input()
  public contest!: Contest;

  @Input()
  public forPrintJobManagement = false;

  constructor(private readonly printJobService: PrintJobService, private readonly dialog: DialogService) {}

  public ngOnInit(): Promise<void> {
    return this.loadPrintJobs();
  }

  public async loadPrintJobs(filter?: PrintJobFilter): Promise<void> {
    this.loading = true;

    try {
      this.printJobs = await this.printJobService.listSummaries(
        this.contest.id,
        filter?.state ?? PrintJobState.PRINT_JOB_STATE_UNSPECIFIED,
        filter?.query ?? '',
      );
    } finally {
      this.loading = false;
    }
  }

  public async updatePrintingCenterSignUpDeadline(): Promise<void> {
    const data: ContestPrintingCenterSignUpDeadlineDialogData = {
      contest: this.contest,
    };
    this.handleContestPrintingCenterSignUpDialogResult(
      await this.dialog.openForResult(ContestPrintingCenterSignUpDeadlineDialogComponent, data),
    );
  }

  private handleContestPrintingCenterSignUpDialogResult(result?: ContestPrintingCenterSignUpDeadlineDialogResult): void {
    if (!result || !result.resetGenerateVotingCardsTriggeredDomainOfInfluenceIds) {
      return;
    }

    for (const doiId of result.resetGenerateVotingCardsTriggeredDomainOfInfluenceIds) {
      const printJob = this.printJobs.find(p => p.domainOfInfluence.id === doiId)!;
      printJob.state = PrintJobState.PRINT_JOB_STATE_SUBMISSION_ONGOING;
      printJob.generateVotingCardsTriggered = undefined;
    }
  }
}
