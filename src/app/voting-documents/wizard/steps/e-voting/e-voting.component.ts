/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { ContestState } from 'src/app/models/contest.model';
import { EVotingDomainOfInfluenceEntry } from '../../../../models/e-voting-domain-of-influence.model';
import { ContestEVotingExportJob } from '../../../../models/e-voting-export-job.model';
import { Step } from '../../../../models/step.model';
import { ContestEVotingExportJobService } from '../../../../services/contest-e-voting-export-job.service';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { StepBaseComponent } from '../step-base.component';
import { AttachmentService } from '../../../../services/attachment.service';
import { Ech0045Version, ExportJobState } from '@abraxas/voting-stimmunterlagen-proto';
import { RadioButton } from '@abraxas/base-components';
import { EnumUtil } from '../../../../services/enum.util';

@Component({
  selector: 'app-e-voting',
  templateUrl: './e-voting.component.html',
  styleUrls: ['./e-voting.component.scss'],
  standalone: false,
})
export class EVotingComponent extends StepBaseComponent {
  private readonly domainOfInfluenceService = inject(DomainOfInfluenceService);
  private readonly contestEVotingExportJobService = inject(ContestEVotingExportJobService);
  private readonly attachmentService = inject(AttachmentService);

  public readonly ech0045VersionItems: RadioButton[] = [];

  public eVotingEntries: EVotingDomainOfInfluenceEntry[] = [];
  public job?: ContestEVotingExportJob;

  public canRetryJob = false;
  public jobSaving = false;
  public attachmentStationsSet = false;
  constructor() {
    super(Step.STEP_E_VOTING);

    const enumUtil = inject(EnumUtil);
    this.ech0045VersionItems = enumUtil
      .getArrayWithDescriptions<Ech0045Version>(Ech0045Version, 'ECH_0045.VERSIONS.')
      .map(i => ({ value: i.value, displayText: i.description }));
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
      this.jobSaving = true;
      await this.contestEVotingExportJobService.retryJob(this.stepInfo.contest.id);
      this.job.state = ExportJobState.EXPORT_JOB_STATE_RUNNING;
      this.updateCanRetryJob();
    } finally {
      this.jobSaving = false;
    }
  }

  private updateCanRetryJob(): void {
    this.canRetryJob =
      !!this.stepInfo &&
      this.stepInfo.contest.state === ContestState.CONTEST_STATE_TESTING_PHASE &&
      this.stepInfo.steps.some(s => s.step === Step.STEP_E_VOTING && s.approved);
    !!this.job &&
      (this.job.state === ExportJobState.EXPORT_JOB_STATE_FAILED ||
        this.job.state === ExportJobState.EXPORT_JOB_STATE_COMPLETED ||
        this.job.state === ExportJobState.EXPORT_JOB_STATE_PENDING);
  }

  public async updateEch0045Version(updatedEch0045Version: Ech0045Version): Promise<void> {
    if (!this.job || !this.stepInfo) {
      return;
    }

    if (this.job.ech0045Version === updatedEch0045Version) {
      return;
    }

    try {
      this.jobSaving = true;
      await this.contestEVotingExportJobService.updateAndResetJob(this.stepInfo.contest.id, updatedEch0045Version);
      this.job = await this.contestEVotingExportJobService.getJob(this.stepInfo.contest.id);
      this.updateCanRetryJob();
    } finally {
      this.jobSaving = false;
    }
  }
}
