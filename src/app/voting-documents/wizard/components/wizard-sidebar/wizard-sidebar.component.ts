/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Step, StepInfo } from '../../../../models/step.model';

@Component({
  selector: 'app-wizard-sidebar',
  templateUrl: './wizard-sidebar.component.html',
  styleUrls: ['./wizard-sidebar.component.scss'],
})
export class WizardSidebarComponent implements OnChanges {
  public readonly Step: typeof Step = Step;
  public stepIsWithinContestDeadlines = false;

  @Input()
  public stepInfo!: StepInfo;

  @Input()
  public hint?: string;

  @Input()
  public warn?: string;

  @Input()
  public canApprove = false;

  @Input()
  public showApprove = true;

  @Input()
  public canRevert = false;

  @Input()
  public approveStateLoading = false;

  @Input()
  public checks: string[] = [];

  @Output()
  public approve: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public revert: EventEmitter<void> = new EventEmitter<void>();

  public checkStates: boolean[] = [];

  public updateChecked(index: number, checked: boolean): void {
    this.checkStates[index] = checked;
    this.checkStates = [...this.checkStates];
  }

  public revertStep(): void {
    if (!this.stepInfo) {
      return;
    }

    this.checkStates = this.checks.map(() => false);
    this.stepInfo.state.approved = false;
    this.revert.emit();
  }

  public ngOnChanges(): void {
    this.stepIsWithinContestDeadlines =
      !!this.stepInfo &&
      (this.stepInfo.state.step === Step.STEP_CONTEST_APPROVAL ||
        this.stepInfo.state.step === Step.STEP_E_VOTING ||
        (this.stepInfo.state.step <= Step.STEP_ATTACHMENTS && !this.stepInfo.contest.isPastPrintingCenterSignUpDeadline) ||
        (this.stepInfo.state.step >= Step.STEP_VOTER_LISTS && !this.stepInfo.contest.isPastGenerateVotingCardsDeadline));
  }
}
