/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomainOfInfluenceVotingCardConfiguration } from '../../../../models/domain-of-influence-voting-card-configuration.model';
import { Step } from '../../../../models/step.model';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { DomainOfInfluenceVotingCardService } from '../../../../services/domain-of-influence-voting-card.service';
import { StepService } from '../../../../services/step.service';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-generate-voting-cards',
  templateUrl: './generate-voting-cards.component.html',
  styleUrls: ['./generate-voting-cards.component.scss'],
})
export class GenerateVotingCardsComponent extends StepBaseComponent {
  public votingCardConfiguration?: DomainOfInfluenceVotingCardConfiguration;
  public previewData?: Uint8Array;
  public previewVotingCardType?: VotingCardType;
  public previewLoading = false;
  public saving = false;
  public votingCardTypes: VotingCardType[] = [];

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly doiVotingCardService: DomainOfInfluenceVotingCardService,
    private readonly layoutService: DomainOfInfluenceVotingCardLayoutService,
  ) {
    super(Step.STEP_GENERATE_VOTING_CARDS, router, route, stepService);
  }

  public async saveConfigurationAndUpdatePreview(): Promise<void> {
    if (!this.votingCardConfiguration) {
      return;
    }

    try {
      this.saving = true;
      await this.doiVotingCardService.setConfiguration(this.votingCardConfiguration);
    } finally {
      this.saving = false;
    }

    await this.updatePreview();
  }

  public async approve(): Promise<void> {
    await super.approve();
    this.canEdit = false;
  }

  public async updatePreview(): Promise<void> {
    delete this.previewData;

    if (!this.stepInfo || !this.previewVotingCardType || !this.votingCardConfiguration) {
      return;
    }

    try {
      this.previewLoading = true;
      this.previewData = await this.doiVotingCardService.getPdfPreview(this.stepInfo.domainOfInfluence.id, this.previewVotingCardType);
    } finally {
      this.previewLoading = false;
    }
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.votingCardTypes = await this.layoutService.getLayouts(this.stepInfo.domainOfInfluence.id).then(x => x.map(y => y.votingCardType));
    this.votingCardConfiguration = await this.doiVotingCardService.getConfiguration(this.stepInfo.domainOfInfluence.id);
    this.previewVotingCardType = this.votingCardTypes[0];

    this.updatePreview();
  }
}
