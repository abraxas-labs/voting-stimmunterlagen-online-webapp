/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Step } from '../../../../models/step.model';
import { ContestService } from '../../../../services/contest.service';
import { PropertyRefresherService } from '../../../../services/property-refresher.service';
import { StepService } from '../../../../services/step.service';
import { addDays, fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { StepBaseComponent } from '../step-base.component';

const daysBeforeTheContestForHint = 21;

@Component({
  selector: 'app-contest-approval',
  templateUrl: './contest-approval.component.html',
  styleUrls: ['./contest-approval.component.scss'],
})
export class ContestApprovalComponent extends StepBaseComponent {
  public printingCenterSignUpDeadlineDate?: string;
  public attachmentDeliveryDeadlineDate?: string;
  public generateVotingCardsDeadlineDate?: string;

  public validPrintingCenterSignUpDeadline = false;
  public validAttachmentDeliveryDeadline = false;
  public validGenerateVotingCardsDeadline = false;
  public showPrintingCenterSignUpDeadlineHint = false;
  public showAttachmentDeliveryDeadlineHint = false;
  public showGenerateVotingCardsDeadlineHint = false;

  private readonly dateToday = fromBcDate(new Date().toISOString().split('T')[0])!;

  constructor(
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly contestService: ContestService,
    private readonly propertyRefresher: PropertyRefresherService,
  ) {
    super(Step.STEP_CONTEST_APPROVAL, router, route, stepService);
  }

  public async approve(): Promise<void> {
    if (
      !this.stepInfo ||
      !this.printingCenterSignUpDeadlineDate ||
      !this.attachmentDeliveryDeadlineDate ||
      !this.generateVotingCardsDeadlineDate
    ) {
      return;
    }

    const printingCenterSignUpDeadlineDate = fromBcDate(this.printingCenterSignUpDeadlineDate)!;
    const attachmentDeliveryDeadlineDate = fromBcDate(this.attachmentDeliveryDeadlineDate)!;
    const generateVotingCardsDeadlineDate = fromBcDate(this.generateVotingCardsDeadlineDate)!;

    this.approveLoading = true;
    try {
      await this.contestService.setDeadlines(
        this.stepInfo.contest.id,
        printingCenterSignUpDeadlineDate,
        attachmentDeliveryDeadlineDate,
        generateVotingCardsDeadlineDate,
      );
      await super.approve();
      this.stepInfo.contest.printingCenterSignUpDeadlineDate = printingCenterSignUpDeadlineDate;
      this.stepInfo.contest.attachmentDeliveryDeadlineDate = attachmentDeliveryDeadlineDate;
      this.stepInfo.contest.generateVotingCardsDeadlineDate = generateVotingCardsDeadlineDate;
      this.stepInfo.contest.approved = new Date();
      this.stepInfo.contest.isApproved = true;
    } finally {
      this.approveLoading = false;
    }
  }

  public async updatePrintingCenterSignUpDeadline(e: string): Promise<void> {
    this.printingCenterSignUpDeadlineDate = e;
    await this.updateValidPrintingCenterSignUpDeadline();
    this.updateShowPrintingCenterSignUpDeadlineHint();
  }

  public async updateAttachmentDeliveryDeadline(e: string): Promise<void> {
    this.attachmentDeliveryDeadlineDate = e;
    await this.updateValidAttachmentDeliveryDeadline();
    this.updateShowAttachmentDeliveryDeadlineHint();
  }

  public async updateGenerateVotingCardsDeadline(e: string): Promise<void> {
    this.generateVotingCardsDeadlineDate = e;
    await this.updateValidGenerateVotingCardsDeadline();
    this.updateShowGenerateVotingCardsDeadlineHint();
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

  private async updateValidPrintingCenterSignUpDeadline(): Promise<void> {
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadlineDate)!;
    await this.propertyRefresher.updateBooleanProperty(
      this,
      'validPrintingCenterSignUpDeadline',
      printingCenterSignUpDeadline > this.dateToday,
    );
  }

  private async updateValidAttachmentDeliveryDeadline(): Promise<void> {
    const attachmentDeliveryDeadline = fromBcDate(this.attachmentDeliveryDeadlineDate)!;
    await this.propertyRefresher.updateBooleanProperty(
      this,
      'validAttachmentDeliveryDeadline',
      attachmentDeliveryDeadline > this.dateToday,
    );
  }

  private async updateValidGenerateVotingCardsDeadline(): Promise<void> {
    const generateVotingCardsDeadline = fromBcDate(this.generateVotingCardsDeadlineDate)!;
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadlineDate);
    await this.propertyRefresher.updateBooleanProperty(
      this,
      'validGenerateVotingCardsDeadline',
      !!printingCenterSignUpDeadline && generateVotingCardsDeadline >= printingCenterSignUpDeadline,
    );
  }

  protected loadData(): Promise<void> {
    // according to bc-people later bc should accept dates directly
    this.printingCenterSignUpDeadlineDate = toBcDate(this.stepInfo?.contest.printingCenterSignUpDeadlineDate);
    this.attachmentDeliveryDeadlineDate = toBcDate(this.stepInfo?.contest.attachmentDeliveryDeadlineDate);
    this.generateVotingCardsDeadlineDate = toBcDate(this.stepInfo?.contest.generateVotingCardsDeadlineDate);
    this.updateShowPrintingCenterSignUpDeadlineHint();
    this.updateShowAttachmentDeliveryDeadlineHint();
    this.updateShowGenerateVotingCardsDeadlineHint();
    return Promise.resolve();
  }

  private showDeadlineHint(dateStr: string): boolean {
    const date = fromBcDate(dateStr)!;
    const datePlusThreeWeeks = new Date(date);
    addDays(datePlusThreeWeeks, daysBeforeTheContestForHint);

    return datePlusThreeWeeks >= this.stepInfo!.contest.date;
  }
}
