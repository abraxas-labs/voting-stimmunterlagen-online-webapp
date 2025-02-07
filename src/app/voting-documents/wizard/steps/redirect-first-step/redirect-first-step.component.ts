/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Step } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StepState } from '../../../../models/step.model';

@Component({
  selector: 'app-redirect-first-step',
  template: '',
})
export class RedirectFirstStepComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): Promise<void> {
    const steps = this.route.snapshot.data.steps;
    return this.navigateToFirstStep(steps ?? []);
  }

  private async navigateToFirstStep(steps: StepState[]): Promise<void> {
    if (steps.length === 0) {
      await this.router.navigate(['no-steps'], { relativeTo: this.route });
      return;
    }

    const step = steps.find(s => !s.approved)?.step ?? Step.STEP_POLITICAL_BUSINESSES_APPROVAL;
    await this.router.navigate([step], { relativeTo: this.route });
  }
}
