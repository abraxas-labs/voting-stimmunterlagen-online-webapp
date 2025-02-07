/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { Step } from '../../../../models/step.model';
import { PoliticalBusinessService } from '../../../../services/political-business.service';
import { StepService } from '../../../../services/step.service';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-political-business-approval',
  templateUrl: './political-business-approval.component.html',
  styleUrls: ['./political-business-approval.component.scss'],
})
export class PoliticalBusinessApprovalComponent extends StepBaseComponent {
  public politicalBusinesses: Record<string, PoliticalBusiness[]> = {};
  public check = '';

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly politicalBusinessService: PoliticalBusinessService,
  ) {
    super(Step.STEP_POLITICAL_BUSINESSES_APPROVAL, router, route, stepService);
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.politicalBusinesses = await this.politicalBusinessService.listGroupedByManager(this.stepInfo.contest.id);
    this.check = Object.values(this.politicalBusinesses).some(x =>
      x.some(y => y.domainOfInfluence.secureConnectId === this.stepInfo?.domainOfInfluence.secureConnectId),
    )
      ? 'STEP_POLITICAL_BUSINESS_APPROVAL.APPROVE_CHECK'
      : 'STEP_POLITICAL_BUSINESS_APPROVAL.APPROVE_CHECK_NONE';
  }
}
