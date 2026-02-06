/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { Step } from '../../../../models/step.model';
import { DomainOfInfluenceVoterLists } from '../../../../models/voter-list.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { DomainOfInfluenceVoterListsBuilder } from '../../../../services/builders/domain-of-influence-voter-lists.builder';
import { StepBaseComponent } from '../step-base.component';
import { environment } from '../../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-voter-lists',
  templateUrl: './voter-lists.component.html',
  styleUrls: ['./voter-lists.component.scss'],
  standalone: false,
})
export class VoterListsComponent extends StepBaseComponent {
  private readonly voterListsBuilder = inject(DomainOfInfluenceVoterListsBuilder);
  private readonly attachmentService = inject(AttachmentService);
  private readonly dateFormatter = inject(DatePipe);
  private readonly i18n = inject(TranslateService);

  public voterLists!: DomainOfInfluenceVoterLists;
  public canEdit = false;
  public attachmentMaxAllowedCountByPoliticalBusiness: Record<string, number> = {};
  public showMissingAttachmentsWarn = false;
  public hasVoterDuplicates = false;
  public isElectoralRegistrationEnabled = false;
  public electoralRegisterEVotingNotActiveHint = '';

  constructor() {
    super(Step.STEP_VOTER_LISTS);
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.voterLists = await this.voterListsBuilder.build(this.stepInfo);
    this.isElectoralRegistrationEnabled =
      this.stepInfo.domainOfInfluence.electoralRegistrationEnabled && environment.isElectoralRegistrationEnabled;

    this.electoralRegisterEVotingNotActiveHint = this.i18n.instant('STEP_VOTER_LISTS.HINT_ELECTORAL_REGISTRATION_E_VOTING_DISABLED', {
      electoralRegisterEVotingFromDate: this.dateFormatter.transform(this.stepInfo.contest.electoralRegisterEVotingFromDate, 'dd.MM.yyyy'),
      generateVotingCardsDeadlineDate: this.dateFormatter.transform(this.stepInfo.contest.generateVotingCardsDeadlineDate, 'dd.MM.yyyy'),
    });

    const attachmentsByPbId = await this.attachmentService.listAttachmentsGroupedByPoliticalBusiness(this.stepInfo.domainOfInfluence.id);
    this.attachmentMaxAllowedCountByPoliticalBusiness = {};

    if (this.stepInfo.domainOfInfluence.externalPrintingCenter) {
      this.refreshAttachmentsWarn();
      return;
    }

    for (const [pbId, attachments] of Object.entries(attachmentsByPbId)) {
      this.attachmentMaxAllowedCountByPoliticalBusiness[pbId] = attachments.reduce(
        (v, b) => Math.min(v, b.domainOfInfluenceAttachmentRequiredCount ?? 0),
        Number.POSITIVE_INFINITY,
      );
    }

    this.refreshAttachmentsWarn();
  }

  public async approve(): Promise<void> {
    await super.approve();
    this.canEdit = false;
  }

  public async revert(): Promise<void> {
    await super.revert();
    this.canEdit = true;
  }

  public async handleVoterListsChange(): Promise<void> {
    this.loading = true;

    try {
      // Reload data because other voter lists could have changed when external duplicates were included.
      await this.loadData();
    } finally {
      this.loading = false;
    }
  }

  public refreshWarn(): void {
    this.refreshAttachmentsWarn();
  }

  private refreshAttachmentsWarn(): void {
    this.showMissingAttachmentsWarn =
      !!this.stepInfo &&
      !this.stepInfo.domainOfInfluence.externalPrintingCenter &&
      this.voterLists.countOfVotingCards.some(
        n => (this.attachmentMaxAllowedCountByPoliticalBusiness[n.politicalBusiness.id] ?? Number.POSITIVE_INFINITY) < n.countOfVotingCards,
      );
  }
}
