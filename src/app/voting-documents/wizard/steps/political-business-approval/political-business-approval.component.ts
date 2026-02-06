/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { Step } from '../../../../models/step.model';
import { PoliticalBusinessService } from '../../../../services/political-business.service';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-political-business-approval',
  templateUrl: './political-business-approval.component.html',
  styleUrls: ['./political-business-approval.component.scss'],
  standalone: false,
})
export class PoliticalBusinessApprovalComponent extends StepBaseComponent {
  private readonly politicalBusinessService = inject(PoliticalBusinessService);

  public politicalBusinesses: Record<string, PoliticalBusiness[]> = {};
  public check = '';

  constructor() {
    super(Step.STEP_POLITICAL_BUSINESSES_APPROVAL);
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    const isContestManager = this.stepInfo.contest.domainOfInfluence.id === this.stepInfo.domainOfInfluence.id;

    this.politicalBusinesses = await this.politicalBusinessService.listGroupedByManager(
      isContestManager ? this.stepInfo.contest.id : undefined,
      isContestManager ? undefined : this.stepInfo.domainOfInfluence.id,
    );
    this.check = Object.values(this.politicalBusinesses).some(x =>
      x.some(y => y.domainOfInfluence.secureConnectId === this.stepInfo?.domainOfInfluence.secureConnectId),
    )
      ? 'STEP_POLITICAL_BUSINESS_APPROVAL.APPROVE_CHECK'
      : 'STEP_POLITICAL_BUSINESS_APPROVAL.APPROVE_CHECK_NONE';
  }
}
