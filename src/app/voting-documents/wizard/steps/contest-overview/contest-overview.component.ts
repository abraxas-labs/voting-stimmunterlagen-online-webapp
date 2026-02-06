/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { Step } from '../../../../models/step.model';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-contest-overview',
  templateUrl: './contest-overview.component.html',
  styleUrls: ['./contest-overview.component.scss'],
  standalone: false,
})
export class ContestOverviewComponent extends StepBaseComponent {
  constructor() {
    super(Step.STEP_CONTEST_OVERVIEW);
  }
}
