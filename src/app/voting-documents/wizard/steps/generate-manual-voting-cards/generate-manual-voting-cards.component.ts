/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ManualVotingCardGeneratorJob } from '../../../../models/manual-voting-card-generator-job.model';
import { Step } from '../../../../models/step.model';
import { newManualVotingCardVoter, ManualVotingCardVoter } from '../../../../models/voter.model';
import { IamService } from '../../../../services/iam.service';
import { ManualVotingCardGeneratorJobService } from '../../../../services/manual-voting-card-generator-job.service';
import { StepService } from '../../../../services/step.service';
import { ToastService } from '../../../../services/toast.service';
import { StepBaseComponent } from '../step-base.component';
import { DialogService } from '../../../../services/dialog.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-generate-manual-voting-cards',
  templateUrl: './generate-manual-voting-cards.component.html',
  styleUrls: ['./generate-manual-voting-cards.component.scss'],
})
export class GenerateManualVotingCardsComponent extends StepBaseComponent {
  public generating = false;
  public jobs: ManualVotingCardGeneratorJob[] = [];
  public newVoter: ManualVotingCardVoter = newManualVotingCardVoter();

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly toast: ToastService,
    private readonly iam: IamService,
    private readonly manualVotingCardGeneratorJobService: ManualVotingCardGeneratorJobService,
    private readonly dialog: DialogService,
    private readonly i18n: TranslateService,
    private readonly dateFormatter: DatePipe,
  ) {
    super(Step.STEP_GENERATE_MANUAL_VOTING_CARDS, router, route, stepService);
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
          firstName: duplicateVoterJob.voter.firstName,
          lastName: duplicateVoterJob.voter.lastName,
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

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.jobs = await this.manualVotingCardGeneratorJobService.list(this.stepInfo.domainOfInfluence.id);
  }

  private async getLatestDuplicateVoterJob(newVoter: ManualVotingCardVoter): Promise<ManualVotingCardGeneratorJob | undefined> {
    return this.jobs.find(
      job =>
        job.voter.firstName === newVoter.firstName &&
        job.voter.lastName === newVoter.lastName &&
        job.voter.dateOfBirth?.getTime() === newVoter.dateOfBirth?.getTime(),
    );
  }
}
