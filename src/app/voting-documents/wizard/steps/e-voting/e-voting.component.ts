/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContestState } from 'src/app/models/contest.model';
import { EVotingDomainOfInfluenceEntry } from '../../../../models/e-voting-domain-of-influence.model';
import { ContestEVotingExportJob } from '../../../../models/e-voting-export-job.model';
import { Step } from '../../../../models/step.model';
import { ContestEVotingExportJobService } from '../../../../services/contest-e-voting-export-job.service';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { StepService } from '../../../../services/step.service';
import { StepBaseComponent } from '../step-base.component';
import { AttachmentService } from '../../../../services/attachment.service';
import { ExportJobState } from '@abraxas/voting-stimmunterlagen-proto';

@Component({
  selector: 'app-e-voting',
  templateUrl: './e-voting.component.html',
  styleUrls: ['./e-voting.component.scss'],
})
export class EVotingComponent extends StepBaseComponent {
  public eVotingEntries: EVotingDomainOfInfluenceEntry[] = [];
  public job?: ContestEVotingExportJob;
  public canRetryJob = false;
  public retrying = false;
  public attachmentStationsSet = false;

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly domainOfInfluenceService: DomainOfInfluenceService,
    private readonly contestEVotingExportJobService: ContestEVotingExportJobService,
    private readonly attachmentService: AttachmentService,
  ) {
    super(Step.STEP_E_VOTING, router, route, stepService);
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.eVotingEntries = await this.domainOfInfluenceService.listEVoting(this.stepInfo.contest.id);
    this.job = await this.contestEVotingExportJobService.getJob(this.stepInfo.contest.id);
    this.attachmentStationsSet = (await this.attachmentService.getAttachmentsProgress(this.stepInfo.contest.id)).stationsSet;
    this.updateCanRetryJob();
  }

  public async retryJob(): Promise<void> {
    if (!this.stepInfo || !this.job) {
      return;
    }

    try {
      this.retrying = true;
      await this.contestEVotingExportJobService.retryJob(this.stepInfo.contest.id);
      this.job.state = ExportJobState.EXPORT_JOB_STATE_RUNNING;
      this.updateCanRetryJob();
    } finally {
      this.retrying = false;
    }
  }

  private updateCanRetryJob(): void {
    this.canRetryJob =
      !!this.stepInfo &&
      this.stepInfo.contest.state === ContestState.CONTEST_STATE_TESTING_PHASE &&
      !!this.job &&
      (this.job.state === ExportJobState.EXPORT_JOB_STATE_FAILED || this.job.state === ExportJobState.EXPORT_JOB_STATE_COMPLETED);
  }
}
