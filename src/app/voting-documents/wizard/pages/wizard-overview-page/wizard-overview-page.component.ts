/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Step } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { NEVER, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { Contest } from '../../../../models/contest.model';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { StepState } from '../../../../models/step.model';

@Component({
  selector: 'app-wizard-overview-page',
  templateUrl: './wizard-overview-page.component.html',
  styleUrls: ['./wizard-overview-page.component.scss'],
  standalone: false,
})
export class WizardOverviewPageComponent implements OnDestroy {
  public contest?: Contest;
  public domainOfInfluence?: DomainOfInfluence;
  public steps?: StepState[];
  public selectedStep?: Step;

  private readonly routerSubscription: Subscription;
  private readonly routerChildSubscription: Subscription;

  constructor() {
    const route = inject(ActivatedRoute);
    const router = inject(Router);

    this.routerSubscription = route.data.subscribe(({ contest, domainOfInfluence, steps }) => {
      this.contest = contest;
      this.domainOfInfluence = domainOfInfluence;
      this.steps = steps;
    });
    this.routerChildSubscription = router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        switchMap(() => route.firstChild?.data ?? NEVER),
      )
      .subscribe(({ step }) => (this.selectedStep = step));
  }

  public ngOnDestroy(): void {
    this.routerChildSubscription.unsubscribe();
    this.routerSubscription.unsubscribe();
  }
}
