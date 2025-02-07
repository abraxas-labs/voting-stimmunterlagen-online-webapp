/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AttachmentTableEntry, mapToAttachmentTableEntries } from '../../../models/attachment.model';
import { PrintJob, PrintJobState } from '../../../models/print-job.model';
import { VotingCardGeneratorJob, VotingCardGeneratorJobState } from '../../../models/voting-card-generator-job.model';
import { ExportJobState } from '../../../models/export-job-state.model';
import { VotingCardPrintFileExportJob } from '../../../models/voting-card-print-file-export-job.model';
import { AttachmentService } from '../../../services/attachment.service';
import { DialogService } from '../../../services/dialog.service';
import { VotingCardGeneratorJobService } from '../../../services/voting-card-generator-job.service';
import { VotingCardPrintFileExportJobService } from '../../../services/voting-card-print-file-export-job.service';
import {
  PrintJobResetStateDialogComponent,
  PrintJobResetStateDialogData,
} from '../../dialogs/print-job-reset-state-dialog/print-job-reset-state-dialog.component';
import {
  PrintJobSetNextStateDialogComponent,
  PrintJobSetNextStateDialogData,
} from '../../dialogs/print-job-set-next-state-dialog/print-job-set-next-state-dialog.component';
import { Contest } from '../../../models/contest.model';
import { Step } from '../../../models/step.model';
import { Roles } from '../../../models/roles.model';
import { ContestOverviewTab } from '../contest-overview-tabs/contest-overview-tabs.component';

@Component({
  selector: 'app-print-job-detail',
  templateUrl: './print-job-detail.component.html',
  styleUrls: ['./print-job-detail.component.scss'],
})
export class PrintJobDetailComponent implements OnDestroy {
  public readonly printJobStates: typeof PrintJobState = PrintJobState;

  public attachmentTableEntries: AttachmentTableEntry[] = [];
  public vcJobs: VotingCardGeneratorJob[] = [];
  public vcPrintFileExportJobs: VotingCardPrintFileExportJob[] = [];
  public printJob!: PrintJob;
  public contest!: Contest;
  public vcJobsCompleted = false;
  public retrying = false;
  public hasFailedPrintFileExportJobs = false;
  public forPrintJobManagement = false;

  private readonly routeSubscription: Subscription;
  public loading = true;
  public editable = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly votingCardGeneratorJobService: VotingCardGeneratorJobService,
    private readonly votingCardPrintFileExportJobService: VotingCardPrintFileExportJobService,
    private readonly attachmentService: AttachmentService,
    private readonly dialog: DialogService,
    private readonly router: Router,
  ) {
    this.routeSubscription = route.data.subscribe(async ({ printJob, contest, editable, roles }) => {
      this.printJob = printJob;
      this.contest = contest;
      this.editable = editable && !this.contest.locked;
      this.forPrintJobManagement = Array.isArray(roles) && roles.includes(Roles.PrintJobManager);
      await this.loadData();
    });
  }

  public async loadData(): Promise<void> {
    if (!this.printJob) {
      return;
    }

    const doiId = this.printJob.domainOfInfluence!.id!;
    this.loading = true;
    try {
      await Promise.all([this.loadJobs(doiId), this.loadAttachments(doiId), this.loadVotingCardPrintFileJobs(doiId)]);
    } finally {
      this.loading = false;
    }
  }

  public async resetState(): Promise<void> {
    const data: PrintJobResetStateDialogData = {
      printJob: this.printJob,
    };

    await this.dialog.openForResult(PrintJobResetStateDialogComponent, data);
  }

  public async setNextState(): Promise<void> {
    const data: PrintJobSetNextStateDialogData = {
      printJob: this.printJob,
    };

    const previousState = data.printJob.state;
    await this.dialog.openForResult(PrintJobSetNextStateDialogComponent, data);

    if (previousState !== data.printJob.state && data.printJob.state === PrintJobState.PRINT_JOB_STATE_PROCESS_STARTED) {
      this.loadVotingCardPrintFileJobs(data.printJob.domainOfInfluence.id);
    }
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  public async retryJobs(): Promise<void> {
    try {
      this.retrying = true;
      await this.votingCardPrintFileExportJobService.retry(this.printJob.domainOfInfluence.id);

      for (const vcPrintFileExportJob of this.vcPrintFileExportJobs) {
        if (vcPrintFileExportJob.state === ExportJobState.EXPORT_JOB_STATE_FAILED) {
          vcPrintFileExportJob.state = ExportJobState.EXPORT_JOB_STATE_READY_TO_RUN;
        }
      }
    } finally {
      this.retrying = false;
    }
  }

  public async back(): Promise<void> {
    const route = this.forPrintJobManagement ? ['../../'] : ['../../', Step.STEP_CONTEST_OVERVIEW];

    await this.router.navigate(route, {
      queryParams: { contestOverviewTab: ContestOverviewTab.PRINT_JOBS },
      relativeTo: this.route,
    });
  }

  private async loadJobs(domainOfInfluenceId: string): Promise<void> {
    this.vcJobs = await this.votingCardGeneratorJobService.listJobs(domainOfInfluenceId);
    this.vcJobsCompleted = this.vcJobs.every(
      x =>
        x.state === VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_COMPLETED ||
        VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_READY_TO_RUN_OFFLINE,
    );
  }

  private async loadAttachments(domainOfInfluenceId: string): Promise<void> {
    this.attachmentTableEntries = mapToAttachmentTableEntries(await this.attachmentService.listCategorySummaries(domainOfInfluenceId));
  }

  private async loadVotingCardPrintFileJobs(domainOfInfluenceId: string): Promise<void> {
    this.vcPrintFileExportJobs = await this.votingCardPrintFileExportJobService.list(domainOfInfluenceId);
    this.hasFailedPrintFileExportJobs = !!this.vcPrintFileExportJobs.find(j => j.state === ExportJobState.EXPORT_JOB_STATE_FAILED);
  }
}
