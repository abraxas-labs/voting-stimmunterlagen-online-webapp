/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ManualVotingCardGeneratorJob } from '../../../../models/manual-voting-card-generator-job.model';
import { Step } from '../../../../models/step.model';
import { ManualVotingCardVoter, newManualVotingCardVoter } from '../../../../models/voter.model';
import { IamService } from '../../../../services/iam.service';
import { ManualVotingCardGeneratorJobService } from '../../../../services/manual-voting-card-generator-job.service';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { ToastService } from '../../../../services/toast.service';
import { StepBaseComponent } from '../step-base.component';
import { DialogService } from '../../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';
import { DomainOfInfluenceVotingCardLayout } from '../../../../models/domain-of-influence-voting-card-layout.model';

@Component({
  selector: 'app-generate-manual-voting-cards',
  templateUrl: './generate-manual-voting-cards.component.html',
  styleUrls: ['./generate-manual-voting-cards.component.scss'],
  standalone: false,
})
export class GenerateManualVotingCardsComponent extends StepBaseComponent {
  private readonly toast = inject(ToastService);
  private readonly iam = inject(IamService);
  private readonly manualVotingCardGeneratorJobService = inject(ManualVotingCardGeneratorJobService);
  private readonly dialog = inject(DialogService);
  private readonly i18n = inject(TranslateService);
  private readonly dateFormatter = inject(DatePipe);
  private readonly doiVotingCardLayoutService = inject(DomainOfInfluenceVotingCardLayoutService);

  public layouts: DomainOfInfluenceVotingCardLayout[] = [];
  public generating = false;
  public printEmpty = false;
  public jobs: ManualVotingCardGeneratorJob[] = [];
  public newVoter: ManualVotingCardVoter = newManualVotingCardVoter();

  constructor() {
    super(Step.STEP_GENERATE_MANUAL_VOTING_CARDS);
  }

  public async createVoter(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    try {
      this.generating = true;

      const duplicateVoterJob = await this.getLatestDuplicateVoterJob(this.newVoter);

      if (duplicateVoterJob) {
        const message = this.i18n.instant('STEP_GENERATE_MANUAL_VOTING_CARDS.DUPLICATE_WARNING_MESSAGE', {
          firstName: duplicateVoterJob.voter!.firstName,
          lastName: duplicateVoterJob.voter!.lastName,
          date: this.dateFormatter.transform(duplicateVoterJob.created, 'dd.MM.yyyy'),
        });

        const isDuplicateConfirmed = await this.dialog.confirm(
          'STEP_GENERATE_MANUAL_VOTING_CARDS.DUPLICATE_WARNING_TITLE',
          message,
          'STEP_GENERATE_MANUAL_VOTING_CARDS.DUPLICATE_WARNING_CONFIRM',
        );

        if (!isDuplicateConfirmed) {
          return;
        }
      }

      await this.manualVotingCardGeneratorJobService.create(this.stepInfo.domainOfInfluence.id, this.newVoter);
      this.jobs = [
        {
          voter: this.newVoter,
          createdBy: await this.iam.getUser(),
          created: new Date(),
          id: '',
        },
        ...this.jobs,
      ];
      this.toast.success('STEP_GENERATE_MANUAL_VOTING_CARDS.SUCCESS');
      this.newVoter = newManualVotingCardVoter();
    } finally {
      this.generating = false;
    }
  }

  public async createEmptyVoter(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    try {
      this.generating = true;
      await this.manualVotingCardGeneratorJobService.createEmpty(this.stepInfo.domainOfInfluence.id);

      this.jobs = [
        {
          createdBy: await this.iam.getUser(),
          created: new Date(),
          id: '',
        },
        ...this.jobs,
      ];
      this.toast.success('STEP_GENERATE_MANUAL_VOTING_CARDS.SUCCESS');
      this.printEmpty = false;
    } finally {
      this.generating = false;
    }
  }

  public updatePrintEmpty(v: boolean) {
    if (v) {
      this.newVoter = newManualVotingCardVoter();
    }

    this.printEmpty = v;
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.jobs = await this.manualVotingCardGeneratorJobService.list(this.stepInfo.domainOfInfluence.id);
    this.layouts = await this.doiVotingCardLayoutService.getLayouts(this.stepInfo.domainOfInfluence.id);
  }
  private async getLatestDuplicateVoterJob(newVoter: ManualVotingCardVoter): Promise<ManualVotingCardGeneratorJob | undefined> {
    return this.jobs.find(
      job =>
        job.voter &&
        job.voter.firstName === newVoter.firstName &&
        job.voter.lastName === newVoter.lastName &&
        job.voter.dateOfBirth?.getTime() === newVoter.dateOfBirth?.getTime(),
    );
  }
}
