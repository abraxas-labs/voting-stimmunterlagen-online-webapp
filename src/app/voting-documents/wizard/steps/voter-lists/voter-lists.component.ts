/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Step } from '../../../../models/step.model';
import { DomainOfInfluenceVoterLists } from '../../../../models/voter-list.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { DomainOfInfluenceVoterListsBuilder } from '../../../../services/builders/domain-of-influence-voter-lists.builder';
import { StepService } from '../../../../services/step.service';
import { StepBaseComponent } from '../step-base.component';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-voter-lists',
  templateUrl: './voter-lists.component.html',
  styleUrls: ['./voter-lists.component.scss'],
})
export class VoterListsComponent extends StepBaseComponent {
  public voterLists!: DomainOfInfluenceVoterLists;
  public canEdit = false;
  public attachmentMaxAllowedCountByPoliticalBusiness: Record<string, number> = {};
  public showMissingAttachmentsWarn = false;
  public hasVoterDuplicates = false;
  public isElectoralRegistrationEnabled = false;

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly voterListsBuilder: DomainOfInfluenceVoterListsBuilder,
    private readonly attachmentService: AttachmentService,
  ) {
    super(Step.STEP_VOTER_LISTS, router, route, stepService);
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.voterLists = await this.voterListsBuilder.build(this.stepInfo);
    this.refreshHasVoterDuplicates();
    this.isElectoralRegistrationEnabled =
      this.stepInfo.domainOfInfluence.electoralRegistrationEnabled && environment.isElectoralRegistrationEnabled;

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

  public refreshWarn(): void {
    this.refreshAttachmentsWarn();
    this.refreshHasVoterDuplicates();
  }

  private refreshAttachmentsWarn(): void {
    this.showMissingAttachmentsWarn =
      !!this.stepInfo &&
      !this.stepInfo.domainOfInfluence.externalPrintingCenter &&
      this.voterLists.numberOfVoters.some(
        n => (this.attachmentMaxAllowedCountByPoliticalBusiness[n.politicalBusiness.id] ?? Number.POSITIVE_INFINITY) < n.numberOfVoters,
      );
  }

  private refreshHasVoterDuplicates(): void {
    this.hasVoterDuplicates = this.voterLists.voterLists.some(vl => vl.hasVoterDuplicates);
  }
}
