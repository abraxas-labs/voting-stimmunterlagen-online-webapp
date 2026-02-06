/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardGeneratorJobState } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, inject } from '@angular/core';
import { VotingCardGeneratorJob } from 'src/app/models/voting-card-generator-job.model';
import { VotingCardGeneratorJobService } from 'src/app/services/voting-card-generator-job.service';
import { AttachmentTableEntry, mapToAttachmentTableEntries } from '../../../../models/attachment.model';
import { Step } from '../../../../models/step.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { StepBaseComponent } from '../step-base.component';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-print-job-overview',
  templateUrl: './print-job-overview.component.html',
  styleUrls: ['./print-job-overview.component.scss'],
  standalone: false,
})
export class PrintJobOverviewComponent extends StepBaseComponent {
  private readonly votingCardGeneratorJobService = inject(VotingCardGeneratorJobService);
  private readonly attachmentService = inject(AttachmentService);
  private readonly toast = inject(ToastService);

  public attachmentTableEntries: AttachmentTableEntry[] = [];
  public jobs: VotingCardGeneratorJob[] = [];
  public hasFailedJobs = false;
  public retrying = false;
  public loadingJobs = false;
  public externalPrintingCenter = false;

  constructor() {
    super(Step.STEP_PRINT_JOB_OVERVIEW);
  }

  public async retryJobs(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    try {
      this.retrying = true;
      await this.votingCardGeneratorJobService.retryJobs(this.stepInfo.domainOfInfluence.id);

      this.hasFailedJobs = false;

      for (const job of this.jobs.filter(
        j =>
          j.state === VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_FAILED ||
          j.state === VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_READY,
      )) {
        job.state = VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_RUNNING;
      }

      this.toast.success('STEP_PRINT_JOB_OVERVIEW.RETRYING');
    } finally {
      this.retrying = false;
    }
  }

  public async loadJobs(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    try {
      this.loadingJobs = true;
      this.jobs = await this.votingCardGeneratorJobService.listJobs(this.stepInfo.domainOfInfluence.id);
      this.hasFailedJobs = this.jobs.some(j => j.state === VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_FAILED);
    } finally {
      this.loadingJobs = false;
    }
  }

  protected async loadData(): Promise<void> {
    await Promise.all([this.loadJobs(), this.loadAttachments()]);
  }

  private async loadAttachments(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    if (this.stepInfo.domainOfInfluence.externalPrintingCenter) {
      this.externalPrintingCenter = true;
      return;
    }

    this.attachmentTableEntries = mapToAttachmentTableEntries(
      await this.attachmentService.listCategorySummaries(this.stepInfo.domainOfInfluence.id),
    );
    this.externalPrintingCenter = false;
  }
}
