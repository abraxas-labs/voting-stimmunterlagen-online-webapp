/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { DomainOfInfluenceVotingCardLayouts } from '../../../../models/domain-of-influence-voting-card-layout.model';
import { Step } from '../../../../models/step.model';
import { Template } from '../../../../models/template.model';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-layout-voting-cards-domain-of-influences',
  templateUrl: './layout-voting-cards-domain-of-influences.component.html',
  styleUrls: ['./layout-voting-cards-domain-of-influences.component.scss'],
  standalone: false,
})
export class LayoutVotingCardsDomainOfInfluencesComponent extends StepBaseComponent {
  private readonly layoutService = inject(DomainOfInfluenceVotingCardLayoutService);

  public layouts: DomainOfInfluenceVotingCardLayouts[] = [];
  public templates: Template[] = [];

  constructor() {
    super(Step.STEP_LAYOUT_VOTING_CARDS_DOMAIN_OF_INFLUENCES);
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
