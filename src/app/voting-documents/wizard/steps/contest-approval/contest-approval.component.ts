/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { Step } from '../../../../models/step.model';
import { ContestService } from '../../../../services/contest.service';
import { addDays, fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { StepBaseComponent } from '../step-base.component';
import { refreshContestDeadlineStates } from '../../../../models/contest.model';

const daysBeforeTheContestForHint = 21;

@Component({
  selector: 'app-contest-approval',
  templateUrl: './contest-approval.component.html',
  styleUrls: ['./contest-approval.component.scss'],
  standalone: false,
})
export class ContestApprovalComponent extends StepBaseComponent {
  private readonly contestService = inject(ContestService);

  public printingCenterSignUpDeadlineDate?: string;
  public attachmentDeliveryDeadlineDate?: string;
  public generateVotingCardsDeadlineDate?: string;
  public electoralRegisterEVotingFromDate?: string;
  public deliveryToPostDeadlineDate?: string;
  public loadingPreview = false;

  public validPrintingCenterSignUpDeadline = false;
  public validAttachmentDeliveryDeadline = false;
  public validGenerateVotingCardsDeadline = false;
  public validDeliveryToPostDeadline = false;
  public validElectoralRegisterEVotingFrom = false;
  public showPrintingCenterSignUpDeadlineHint = false;
  public showAttachmentDeliveryDeadlineHint = false;
  public showGenerateVotingCardsDeadlineHint = false;
  public validStandardDeliveryToPostDeadline = false;

  public originalPrintingCenterSignUpDeadlineDate?: string;
  public originalAttachmentDeliveryDeadlineDate?: string;
  public originalGenerateVotingCardsDeadlineDate?: string;
  public originalElectoralRegisterEVotingFromDate?: string;
  public originalDeliveryToPostDeadlineDate?: string;
  public hasChanges: boolean = false;

  private readonly dateToday = fromBcDate(new Date().toISOString().split('T')[0])!;

  constructor() {
    super(Step.STEP_CONTEST_APPROVAL);
  }

  public async approve(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    if (this.isCommunalContest) {
      if (!this.deliveryToPostDeadlineDate) {
        return;
      }

      const deliveryToPostDate = fromBcDate(this.deliveryToPostDeadlineDate!);
      this.approveLoading = true;

      try {
        if (this.hasChanges) {
          const communalDeadlinesResponse = await this.contestService.setCommunalDeadlines(this.stepInfo.contest.id, deliveryToPostDate!);

          this.stepInfo.contest.printingCenterSignUpDeadlineDate = communalDeadlinesResponse.printingCenterSignUpDeadlineDate;
          this.stepInfo.contest.attachmentDeliveryDeadlineDate = communalDeadlinesResponse.attachmentDeliveryDeadlineDate;
          this.stepInfo.contest.generateVotingCardsDeadlineDate = communalDeadlinesResponse.generateVotingCardsDeadlineDate;
          this.stepInfo.contest.deliveryToPostDeadlineDate = communalDeadlinesResponse.deliveryToPostDeadlineDate;
          this.stepInfo.contest.electoralRegisterEVotingFromDate = undefined; // is never set on communal contest
        }

        await super.approve();
        this.stepInfo.contest.approved = new Date();
        this.stepInfo.contest.isApproved = true;
        refreshContestDeadlineStates(this.stepInfo.contest);
      } catch (err) {
        this.stepInfo.state.approved = false;
      } finally {
        this.approveLoading = false;
      }

      return;
    }

    if (!this.printingCenterSignUpDeadlineDate || !this.attachmentDeliveryDeadlineDate || !this.generateVotingCardsDeadlineDate) {
      return;
    }

    const printingCenterSignUpDeadlineDate = fromBcDate(this.printingCenterSignUpDeadlineDate)!;
    const attachmentDeliveryDeadlineDate = fromBcDate(this.attachmentDeliveryDeadlineDate)!;
    const generateVotingCardsDeadlineDate = fromBcDate(this.generateVotingCardsDeadlineDate)!;
    const electoralRegisterEVotingFromDate = fromBcDate(this.electoralRegisterEVotingFromDate);

    this.approveLoading = true;
    try {
      if (this.hasChanges) {
        await this.contestService.setDeadlines(
          this.stepInfo.contest.id,
          printingCenterSignUpDeadlineDate,
          attachmentDeliveryDeadlineDate,
          generateVotingCardsDeadlineDate,
          electoralRegisterEVotingFromDate,
        );

        this.stepInfo.contest.printingCenterSignUpDeadlineDate = printingCenterSignUpDeadlineDate;
        this.stepInfo.contest.attachmentDeliveryDeadlineDate = attachmentDeliveryDeadlineDate;
        this.stepInfo.contest.generateVotingCardsDeadlineDate = generateVotingCardsDeadlineDate;
        this.stepInfo.contest.electoralRegisterEVotingFromDate = electoralRegisterEVotingFromDate;
        this.stepInfo.contest.deliveryToPostDeadlineDate = undefined; // is never set on non-communal contests
      }

      await super.approve();
      this.stepInfo.contest.approved = new Date();
      this.stepInfo.contest.isApproved = true;
      refreshContestDeadlineStates(this.stepInfo.contest);
    } catch (err) {
      this.stepInfo.state.approved = false;
    } finally {
      this.approveLoading = false;
    }
  }

  public updatePrintingCenterSignUpDeadline(e: string): void {
    if (e === this.printingCenterSignUpDeadlineDate) {
      return;
    }

    this.printingCenterSignUpDeadlineDate = e;
    this.updateDeadlineRelatedFields();
  }

  public updateAttachmentDeliveryDeadline(e: string): void {
    if (e === this.attachmentDeliveryDeadlineDate) {
      return;
    }

    this.attachmentDeliveryDeadlineDate = e;
    this.updateDeadlineRelatedFields();
  }

  public updateGenerateVotingCardsDeadline(e: string): void {
    if (e === this.generateVotingCardsDeadlineDate) {
      return;
    }

    this.generateVotingCardsDeadlineDate = e;
    this.updateDeadlineRelatedFields();
  }

  public updateElectoralRegisterEVotingFromDate(e: string): void {
    if (e === this.electoralRegisterEVotingFromDate) {
      return;
    }

    this.electoralRegisterEVotingFromDate = e;
    this.updateDeadlineRelatedFields();
  }

  public async updateDeliveryToPostDeadline(e: string): Promise<void> {
    if (e === this.deliveryToPostDeadlineDate) {
      return;
    }

    this.deliveryToPostDeadlineDate = e;
    this.updateDeadlineRelatedFields();

    if (!this.validDeliveryToPostDeadline) {
      return;
    }

    try {
      this.loadingPreview = true;
      const calculationResult = await this.contestService.getPreviewCommunalDeadlines(
        this.stepInfo!.contest.id,
        fromBcDate(this.deliveryToPostDeadlineDate)!,
      );
      this.printingCenterSignUpDeadlineDate = toBcDate(calculationResult.printingCenterSignUpDeadlineDate);
      this.attachmentDeliveryDeadlineDate = toBcDate(calculationResult.attachmentDeliveryDeadlineDate);
      this.generateVotingCardsDeadlineDate = toBcDate(calculationResult.generateVotingCardsDeadlineDate);
    } finally {
      this.loadingPreview = false;
      this.updateDeadlineRelatedFields();
    }
  }

  private updateShowPrintingCenterSignUpDeadlineHint(): void {
    if (!this.printingCenterSignUpDeadlineDate || !this.stepInfo) {
      this.showPrintingCenterSignUpDeadlineHint = false;
      return;
    }

    this.showPrintingCenterSignUpDeadlineHint = this.showDeadlineHint(this.printingCenterSignUpDeadlineDate);
  }

  private updateShowAttachmentDeliveryDeadlineHint(): void {
    if (!this.attachmentDeliveryDeadlineDate || !this.stepInfo) {
      this.showAttachmentDeliveryDeadlineHint = false;
      return;
    }

    this.showAttachmentDeliveryDeadlineHint = this.showDeadlineHint(this.attachmentDeliveryDeadlineDate);
  }

  private updateShowGenerateVotingCardsDeadlineHint(): void {
    if (!this.generateVotingCardsDeadlineDate || !this.stepInfo) {
      this.showGenerateVotingCardsDeadlineHint = false;
      return;
    }

    this.showGenerateVotingCardsDeadlineHint = this.showDeadlineHint(this.generateVotingCardsDeadlineDate);
  }

  private updateValidStandardDeliveryToPostDeadline(): void {
    if (!this.deliveryToPostDeadlineDate) {
      this.validStandardDeliveryToPostDeadline = false;
      return;
    }

    const deliveryToPostDeadline = fromBcDate(this.deliveryToPostDeadlineDate)!;

    const maxDate = this.stepInfo!.contest.date;
    const minDate = new Date(this.dateToday);

    addDays(minDate, 31);
    this.validStandardDeliveryToPostDeadline = deliveryToPostDeadline < maxDate && deliveryToPostDeadline >= minDate;
  }

  protected loadData(): Promise<void> {
    // according to bc-people later bc should accept dates directly
    this.originalPrintingCenterSignUpDeadlineDate = this.printingCenterSignUpDeadlineDate = toBcDate(
      this.stepInfo?.contest.printingCenterSignUpDeadlineDate,
    );
    this.originalAttachmentDeliveryDeadlineDate = this.attachmentDeliveryDeadlineDate = toBcDate(
      this.stepInfo?.contest.attachmentDeliveryDeadlineDate,
    );
    this.originalGenerateVotingCardsDeadlineDate = this.generateVotingCardsDeadlineDate = toBcDate(
      this.stepInfo?.contest.generateVotingCardsDeadlineDate,
    );
    this.originalElectoralRegisterEVotingFromDate = this.electoralRegisterEVotingFromDate = toBcDate(
      this.stepInfo?.contest.electoralRegisterEVotingFromDate,
    );
    this.originalDeliveryToPostDeadlineDate = this.deliveryToPostDeadlineDate = toBcDate(this.stepInfo?.contest.deliveryToPostDeadlineDate);
    this.updateDeadlineRelatedFields();
    return Promise.resolve();
  }

  private showDeadlineHint(dateStr: string): boolean {
    const date = fromBcDate(dateStr)!;
    const datePlusThreeWeeks = new Date(date);
    addDays(datePlusThreeWeeks, daysBeforeTheContestForHint);

    return datePlusThreeWeeks >= this.stepInfo!.contest.date;
  }

  private updateDeadlineRelatedFields(): void {
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadlineDate);
    this.validPrintingCenterSignUpDeadline = !!printingCenterSignUpDeadline && printingCenterSignUpDeadline >= this.dateToday;

    const attachmentDeliveryDeadline = fromBcDate(this.attachmentDeliveryDeadlineDate);
    this.validAttachmentDeliveryDeadline = !!attachmentDeliveryDeadline && attachmentDeliveryDeadline >= this.dateToday;

    const generateVotingCardsDeadline = fromBcDate(this.generateVotingCardsDeadlineDate);
    this.validGenerateVotingCardsDeadline =
      !!printingCenterSignUpDeadline && !!generateVotingCardsDeadline && generateVotingCardsDeadline >= printingCenterSignUpDeadline;

    const electoralRegisterEVotingFrom = fromBcDate(this.electoralRegisterEVotingFromDate);
    this.validElectoralRegisterEVotingFrom =
      !!electoralRegisterEVotingFrom &&
      !!generateVotingCardsDeadline &&
      electoralRegisterEVotingFrom >= this.dateToday &&
      electoralRegisterEVotingFrom <= generateVotingCardsDeadline;

    const deliveryToPostDeadline = fromBcDate(this.deliveryToPostDeadlineDate);
    const maxDate = this.stepInfo!.contest.date;
    this.validDeliveryToPostDeadline =
      !!deliveryToPostDeadline && deliveryToPostDeadline < maxDate && deliveryToPostDeadline >= this.dateToday;

    this.updateValidStandardDeliveryToPostDeadline();
    this.updateShowPrintingCenterSignUpDeadlineHint();
    this.updateShowAttachmentDeliveryDeadlineHint();
    this.updateShowGenerateVotingCardsDeadlineHint();
    this.updateHasChanges();
  }

  private updateHasChanges(): void {
    if (!this.stepInfo || this.hasChanges) {
      return;
    }

    this.hasChanges =
      this.originalAttachmentDeliveryDeadlineDate !== this.attachmentDeliveryDeadlineDate ||
      this.originalDeliveryToPostDeadlineDate !== this.deliveryToPostDeadlineDate ||
      this.originalGenerateVotingCardsDeadlineDate !== this.generateVotingCardsDeadlineDate ||
      this.originalElectoralRegisterEVotingFromDate !== this.electoralRegisterEVotingFromDate ||
      this.originalPrintingCenterSignUpDeadlineDate !== this.printingCenterSignUpDeadlineDate;
  }
}
