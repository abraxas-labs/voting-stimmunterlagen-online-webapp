/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, inject } from '@angular/core';
import { DomainOfInfluenceVotingCardConfiguration } from '../../../../models/domain-of-influence-voting-card-configuration.model';
import { Step } from '../../../../models/step.model';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { DomainOfInfluenceVotingCardService } from '../../../../services/domain-of-influence-voting-card.service';
import { StepBaseComponent } from '../step-base.component';
import { DialogService } from '../../../../services/dialog.service';
import { PoliticalBusinessService } from '../../../../services/political-business.service';

@Component({
  selector: 'app-generate-voting-cards',
  templateUrl: './generate-voting-cards.component.html',
  styleUrls: ['./generate-voting-cards.component.scss'],
  standalone: false,
})
export class GenerateVotingCardsComponent extends StepBaseComponent {
  private readonly dialog = inject(DialogService);
  private readonly doiVotingCardService = inject(DomainOfInfluenceVotingCardService);
  private readonly layoutService = inject(DomainOfInfluenceVotingCardLayoutService);
  private readonly politicalBusinessService = inject(PoliticalBusinessService);

  public votingCardConfiguration?: DomainOfInfluenceVotingCardConfiguration;
  public previewData?: Uint8Array;
  public previewVotingCardType?: VotingCardType;
  public previewLoading = false;
  public saving = false;
  public votingCardTypes: VotingCardType[] = [];
  public politicalBusinessesEVotingNotApproved = false;

  constructor() {
    super(Step.STEP_GENERATE_VOTING_CARDS);
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
    if (!this.stepInfo) {
      return;
    }
    const isConfirmed = await this.dialog.confirm(
      'STEP_GENERATE_VOTING_CARDS.CONFIRM_TITLE',
      'STEP_GENERATE_VOTING_CARDS.CONFIRM_MESSAGE',
      undefined,
      undefined,
      'primary',
    );
    if (!isConfirmed) {
      this.stepInfo.state.approved = false;
      return;
    }
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

    if (this.isEVotingContest && this.isEVotingDomainOfInfluence) {
      const pbs = await this.politicalBusinessService.listForDomainOfInfluence(this.stepInfo.domainOfInfluence.id);
      this.politicalBusinessesEVotingNotApproved = pbs.some(pb => pb.eVotingApproved === false);
    }

    this.updatePreview();
  }
}
