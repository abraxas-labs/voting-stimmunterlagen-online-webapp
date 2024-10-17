/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainOfInfluenceVotingCardLayouts } from '../../../../models/domain-of-influence-voting-card-layout.model';
import { Step } from '../../../../models/step.model';
import { Template } from '../../../../models/template.model';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { StepService } from '../../../../services/step.service';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-layout-voting-cards-domain-of-influences',
  templateUrl: './layout-voting-cards-domain-of-influences.component.html',
  styleUrls: ['./layout-voting-cards-domain-of-influences.component.scss'],
})
export class LayoutVotingCardsDomainOfInfluencesComponent extends StepBaseComponent {
  public layouts: DomainOfInfluenceVotingCardLayouts[] = [];
  public templates: Template[] = [];

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly layoutService: DomainOfInfluenceVotingCardLayoutService,
  ) {
    super(Step.STEP_LAYOUT_VOTING_CARDS_DOMAIN_OF_INFLUENCES, router, route, stepService);
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    [this.layouts, this.templates] = await Promise.all([
      this.layoutService.getLayoutsForContest(this.stepInfo.contest.id),
      !this.canEdit ? Promise.resolve([]) : this.layoutService.getTemplates(this.stepInfo.contest.id),
    ]);
  }
}
