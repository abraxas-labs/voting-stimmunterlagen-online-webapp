/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { AttachmentService } from 'src/app/services/attachment.service';
import { DomainOfInfluenceAttachmentCategorySummariesEntry } from '../../../../models/attachment.model';
import { Step } from '../../../../models/step.model';
import { StepBaseComponent } from '../step-base.component';

@Component({
  selector: 'app-attachments',
  templateUrl: './attachments.component.html',
  styleUrls: ['./attachments.component.scss'],
  standalone: false,
})
export class AttachmentsComponent extends StepBaseComponent {
  private readonly attachmentService = inject(AttachmentService);

  public loading = false;
  public doiAttachmentCategorySummariesEntries: DomainOfInfluenceAttachmentCategorySummariesEntry[] = [];
  public checks: string[] = [];
  public canApprove = false;

  constructor() {
    super(Step.STEP_ATTACHMENTS);
  }

  public updateCanApprove(): void {
    this.canApprove =
      this.stepInfo !== undefined &&
      (!this.stepInfo.domainOfInfluence.responsibleForVotingCards ||
        this.doiAttachmentCategorySummariesEntries.every(
          d =>
            d.domainOfInfluence.type > this.stepInfo!.domainOfInfluence.type ||
            d.attachmentCategorySummaries.every(s => s.attachments.every(a => a.domainOfInfluenceAttachmentRequiredCount !== undefined)),
        ));
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    this.doiAttachmentCategorySummariesEntries = await this.attachmentService.listDomainOfInfluenceAttachmentCategorySummaries(
      this.stepInfo.domainOfInfluence.id,
    );

    if (this.stepInfo.domainOfInfluence.responsibleForVotingCards) {
      this.checks = ['STEP_ATTACHMENTS.CHECK_COMPLETE', 'STEP_ATTACHMENTS.CHECK_COUNT'];
    } else {
      this.checks = ['STEP_ATTACHMENTS.CHECK_COMPLETE'];
    }

    this.updateCanApprove();
  }
}
