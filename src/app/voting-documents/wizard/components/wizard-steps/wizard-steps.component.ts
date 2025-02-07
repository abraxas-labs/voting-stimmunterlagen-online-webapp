/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Step } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StepState } from '../../../../models/step.model';
import { StepService } from '../../../../services/step.service';

@Component({
  selector: 'app-wizard-steps',
  templateUrl: './wizard-steps.component.html',
  styleUrls: ['./wizard-steps.component.scss'],
})
export class WizardStepsComponent implements OnDestroy {
  @Input()
  public stepStates: StepState[] = [];

  public selectedStepValue?: Step;

  public selectedIndex = 0;

  private readonly approveChangeSubscription: Subscription;

  constructor(
    wizardService: StepService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.approveChangeSubscription = wizardService.stepApproveChanged$.subscribe(({ approved, step }) => {
      const stepState = this.stepStates.find(x => x.step === step);
      if (!stepState) {
        return;
      }

      stepState.approved = approved;
      wizardService.updateWizardProperties(this.stepStates);
      this.stepStates = [...this.stepStates];
    });
  }

  @Input()
  public set selectedStep(s: Step | undefined) {
    this.selectedStepValue = s;
    if (s !== undefined) {
      this.selectedIndex = this.stepStates.findIndex(x => x.step === s);
    } else {
      this.selectedIndex = 0;
    }
  }

  public ngOnDestroy(): void {
    this.approveChangeSubscription.unsubscribe();
  }

  public async showStep(idx: number): Promise<void> {
    const step = this.stepStates[idx];
    await this.router.navigate([step.step], { relativeTo: this.route });
    this.selectedIndex = idx;
  }
}
