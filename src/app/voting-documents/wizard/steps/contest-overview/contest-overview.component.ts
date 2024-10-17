/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Step } from '../../../../models/step.model';
import { StepService } from '../../../../services/step.service';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-contest-overview',
  templateUrl: './contest-overview.component.html',
  styleUrls: ['./contest-overview.component.scss'],
})
export class ContestOverviewComponent extends StepBaseComponent {
  constructor(router: Router, route: ActivatedRoute, stepService: StepService) {
    super(Step.STEP_CONTEST_OVERVIEW, router, route, stepService);
  }
}
