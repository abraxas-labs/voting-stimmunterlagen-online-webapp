/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ApproveStepRequest, ListStepsRequest, RevertStepRequest, StepServiceClient } from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { Step, StepState } from '../models/step.model';
import { groupBySingle } from './utils/array.utils';

export interface StepApproveChange {
  step: Step;
  approved: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StepService {
  private readonly client = inject(StepServiceClient);

  private readonly stepApproveChanged: Subject<StepApproveChange> = new Subject<StepApproveChange>();

  public get stepApproveChanged$(): Observable<StepApproveChange> {
    return this.stepApproveChanged;
  }

  public list(domainOfInfluenceId: string): Promise<StepState[]> {
    return firstValueFrom(this.client.list(new ListStepsRequest({ domainOfInfluenceId }))).then(x => {
      const steps = x.toObject().steps as StepState[];
      this.updateWizardProperties(steps);
      return steps;
    });
  }

  public async revert(domainOfInfluenceId: string, step: Step): Promise<void> {
    await firstValueFrom(this.client.revert(new RevertStepRequest({ domainOfInfluenceId, step })));
    this.stepApproveChanged.next({
      approved: false,
      step,
    });
  }

  public async approve(domainOfInfluenceId: string, step: Step): Promise<void> {
    await firstValueFrom(this.client.approve(new ApproveStepRequest({ domainOfInfluenceId, step })));
    this.stepApproveChanged.next({
      approved: true,
      step,
    });
  }

  public updateWizardProperties(steps: StepState[]): void {
    const lastApprovedStep = steps
      .slice()
      .reverse()
      .find(s => s.approved);
    const firstNotApprovedStep = steps.find(s => !s.approved);
    for (const step of steps) {
      step.progressState = step.approved ? 'complete' : step === firstNotApprovedStep ? 'progress' : 'open';
      step.disabled = step.progressState === 'open';
      step.canApprove = !step.approved && step === firstNotApprovedStep;
      step.canRevert = step.approved && step === lastApprovedStep;
    }

    const stepsByStep = groupBySingle(
      steps,
      x => x.step,
      x => x,
    );
    const generateVotingCardsStep = stepsByStep[Step.STEP_GENERATE_VOTING_CARDS];
    const generateManualVotingCardsStep = stepsByStep[Step.STEP_GENERATE_MANUAL_VOTING_CARDS];
    const contestOverviewStep = stepsByStep[Step.STEP_CONTEST_OVERVIEW];
    const votingJournalStep = stepsByStep[Step.STEP_VOTING_JOURNAL];

    if (generateVotingCardsStep !== undefined && generateManualVotingCardsStep !== undefined) {
      generateManualVotingCardsStep.disabled = !generateVotingCardsStep.approved;
      generateManualVotingCardsStep.progressState = generateVotingCardsStep.approved ? 'progress' : 'open';
    }

    if (votingJournalStep !== undefined && generateManualVotingCardsStep !== undefined) {
      votingJournalStep.disabled = generateManualVotingCardsStep.disabled;
      votingJournalStep.progressState = generateManualVotingCardsStep.progressState;
    }

    if (contestOverviewStep !== undefined) {
      contestOverviewStep.disabled = false;
      contestOverviewStep.progressState = 'progress';
    }
  }
}
