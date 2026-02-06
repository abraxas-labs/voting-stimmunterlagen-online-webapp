/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Step } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Contest } from '../../../models/contest.model';
import { DomainOfInfluence } from '../../../models/domain-of-influence.model';
import { StepInfo, StepState } from '../../../models/step.model';
import { StepService } from '../../../services/step.service';
import { isCommunal } from '../../../services/utils/domain-of-influence.utils';

// workaround for NG2007: pseudo component
// this is needed since an angular annotation is needed to be able to implement an angular hook
@Component({
  template: '',
  standalone: false,
})
export abstract class StepBaseComponent implements OnInit, OnDestroy {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly stepService = inject(StepService);

  public loading = true;
  public approveLoading = false;
  public stepInfo?: StepInfo;
  public steps: StepState[] = [];
  public canEdit = false;
  public isCommunalContest = false;
  public isEVotingContest = false;
  public isEVotingDomainOfInfluence = false;

  private routeSubscription?: Subscription;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  protected constructor(public readonly step: Step) {}

  public ngOnInit() {
    // subscribe to route changes in on init instead of the constructor,
    // if subscribed in the constructor, an event could occur before the ctor of the subclass is executed
    // which would lead to e method invocation of the subclass without running it's ctor
    this.routeSubscription = this.route.data
      .pipe(tap(({ contest, domainOfInfluence, steps }) => this.updateStepInfo(contest, domainOfInfluence, steps)))
      .subscribe(() => this.tryLoadData());
  }

  public ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  public async revert(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    try {
      this.approveLoading = true;
      await this.stepService.revert(this.stepInfo.domainOfInfluence.id, this.step);
      this.stepInfo.state.approved = false;
      this.stepInfo.state.canApprove = true;
      this.stepInfo.state.canRevert = false;
      this.canEdit = true;
    } finally {
      this.approveLoading = false;
    }
  }

  public async approve(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    try {
      this.approveLoading = true;
      await this.stepService.approve(this.stepInfo.domainOfInfluence.id, this.step);
      this.stepInfo.state.approved = true;
      this.stepInfo.state.canApprove = false;
      this.stepInfo.state.canRevert = true;
      this.canEdit = false;
      await this.tryNavigateToFirstStep(false);
    } finally {
      this.approveLoading = false;
    }
  }

  protected loadData(): Promise<void> {
    return Promise.resolve();
  }

  protected async tryNavigateToFirstStep(approved: boolean): Promise<void> {
    const s = this.steps.find(s => s.approved === approved);
    if (s !== undefined) {
      await this.router.navigate(['..', s.step], { relativeTo: this.route });
    }
  }

  private async tryLoadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.loading = true;
    try {
      this.canEdit =
        !this.stepInfo.state.approved &&
        !this.stepInfo.contest.locked &&
        (this.stepInfo.state.step === Step.STEP_CONTEST_APPROVAL ||
          this.stepInfo.state.step === Step.STEP_E_VOTING ||
          (this.stepInfo.state.step <= Step.STEP_ATTACHMENTS && !this.stepInfo.contest.isPastPrintingCenterSignUpDeadline) ||
          (this.stepInfo.state.step >= Step.STEP_VOTER_LISTS && !this.stepInfo.contest.isPastGenerateVotingCardsDeadline));
      await this.loadData();
    } finally {
      this.loading = false;
    }
  }

  private updateStepInfo(contest: Contest, domainOfInfluence: DomainOfInfluence, steps: StepState[]): void {
    this.steps = steps;
    this.stepInfo = {
      contest,
      domainOfInfluence,
      steps,
      state: steps.find(s => s.step === this.step) ?? {
        step: this.step,
        approved: false,
        canApprove: true,
        canRevert: false,
        progressState: 'progress',
        disabled: false,
      },
    };
    this.isCommunalContest = isCommunal(contest.domainOfInfluence.type);
    this.isEVotingContest = contest.eVoting;
    this.isEVotingDomainOfInfluence = domainOfInfluence.eVoting ?? false;
  }
}
