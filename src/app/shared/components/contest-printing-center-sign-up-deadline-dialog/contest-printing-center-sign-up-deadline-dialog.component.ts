/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CheckableItems } from '../../../models/checkable-item.model';
import { Contest, refreshContestDeadlineStates } from '../../../models/contest.model';
import { PrintJob } from '../../../models/print-job.model';
import { ContestService } from '../../../services/contest.service';
import { PrintJobService } from '../../../services/print-job.service';
import { ToastService } from '../../../services/toast.service';
import { addDays, fromBcDate, toBcDate } from '../../../services/utils/date.utils';
import { isCommunal } from '../../../services/utils/domain-of-influence.utils';

const daysBeforeTheContestForHint = 21;

@Component({
  selector: 'app-contest-printing-center-sign-up-deadline-dialog',
  templateUrl: './contest-printing-center-sign-up-deadline-dialog.component.html',
  styleUrls: ['./contest-printing-center-sign-up-deadline-dialog.component.scss'],
  standalone: false,
})
export class ContestPrintingCenterSignUpDeadlineDialogComponent implements OnInit {
  public readonly data = inject<ContestPrintingCenterSignUpDeadlineDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<ContestPrintingCenterSignUpDeadlineDialogComponent>>(MatDialogRef);
  private readonly contestService = inject(ContestService);
  private readonly printJobService = inject(PrintJobService);
  private readonly toast = inject(ToastService);

  public readonly columns = ['checkbox', 'authority', 'domainOfInfluence'];
  public readonly contest!: Contest;

  public saving = false;
  public forPrintJobManagement = false;
  public checkablePrintJobs: CheckableItems<PrintJob> = new CheckableItems<PrintJob>([]);

  public printingCenterSignUpDeadlineDate?: string;
  public attachmentDeliveryDeadlineDate?: string;
  public generateVotingCardsDeadlineDate?: string;
  public deliveryToPostDeadlineDate?: string;

  public showPrintingCenterSignUpDeadlineHint = false;
  public showAttachmentDeliveryDeadlineHint = false;
  public showGenerateVotingCardsDeadlineHint = false;
  public validPrintingCenterSignUpDeadline = false;
  public validAttachmentDeliveryDeadline = false;
  public validGenerateVotingCardsDeadline = false;
  public validDeliveryToPostDeadline = false;

  private readonly dateToday = fromBcDate(new Date().toISOString().split('T')[0])!;

  constructor() {
    this.contest = this.data.contest;
    this.forPrintJobManagement = this.data.forPrintJobManagement;
  }

  public async ngOnInit(): Promise<void> {
    const printJobs = await this.printJobService.listGenerateVotingCardsTriggered(this.contest.id);
    this.checkablePrintJobs = new CheckableItems(printJobs.map(p => ({ item: p, checked: false })));

    // according to bc-people later bc should accept dates directly
    this.printingCenterSignUpDeadlineDate = toBcDate(this.contest.printingCenterSignUpDeadlineDate);
    this.attachmentDeliveryDeadlineDate = toBcDate(this.contest.attachmentDeliveryDeadlineDate);
    this.generateVotingCardsDeadlineDate = toBcDate(this.contest.generateVotingCardsDeadlineDate);
    this.deliveryToPostDeadlineDate = toBcDate(this.contest.deliveryToPostDeadlineDate);
  }

  public async save(): Promise<void> {
    try {
      const printingCenterSignUpDeadlineDate = fromBcDate(this.printingCenterSignUpDeadlineDate)!;
      const generateVotingCardsDeadlineDate = fromBcDate(this.generateVotingCardsDeadlineDate)!;
      const resetGenerateVotingCardsTriggeredDomainOfInfluenceIds = this.checkablePrintJobs.checkedItems.map(v => v.domainOfInfluence.id);

      this.saving = true;

      if (!isCommunal(this.contest.domainOfInfluence.type)) {
        await this.contestService.resetGenerateVotingCardsAndUpdateContestDeadlines(
          this.contest.id,
          printingCenterSignUpDeadlineDate,
          generateVotingCardsDeadlineDate,
          resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
        );
      } else {
        const attachmentDeliveryDeadlineDate = fromBcDate(this.attachmentDeliveryDeadlineDate)!;
        const deliveryToPostDeadlineDate = fromBcDate(this.deliveryToPostDeadlineDate)!;

        await this.contestService.resetGenerateVotingCardsAndUpdateCommunalContestDeadlines(
          this.contest.id,
          printingCenterSignUpDeadlineDate,
          generateVotingCardsDeadlineDate,
          attachmentDeliveryDeadlineDate,
          deliveryToPostDeadlineDate,
          resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
        );

        this.contest.attachmentDeliveryDeadlineDate = attachmentDeliveryDeadlineDate;
        this.contest.deliveryToPostDeadlineDate = deliveryToPostDeadlineDate;
      }

      this.contest.printingCenterSignUpDeadlineDate = printingCenterSignUpDeadlineDate;
      this.contest.generateVotingCardsDeadlineDate = generateVotingCardsDeadlineDate;

      refreshContestDeadlineStates(this.contest);
      this.toast.saved();
      this.done(resetGenerateVotingCardsTriggeredDomainOfInfluenceIds);
    } finally {
      this.saving = false;
    }
  }

  public done(resetGenerateVotingCardsTriggeredDomainOfInfluenceIds?: string[]): void {
    const result: ContestPrintingCenterSignUpDeadlineDialogResult = {
      resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
    };

    this.dialogRef.close(result);
  }

  public async updatePrintingCenterSignUpDeadline(e: string): Promise<void> {
    this.printingCenterSignUpDeadlineDate = e;
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadlineDate);
    this.validPrintingCenterSignUpDeadline = !!printingCenterSignUpDeadline && printingCenterSignUpDeadline >= this.dateToday;
    this.updateShowPrintingCenterSignUpDeadlineHint();
  }

  public updateAttachmentDeliveryDeadline(e: string): void {
    this.attachmentDeliveryDeadlineDate = e;
    const attachmentDeliveryDeadline = fromBcDate(this.attachmentDeliveryDeadlineDate);
    this.validAttachmentDeliveryDeadline = !!attachmentDeliveryDeadline && attachmentDeliveryDeadline >= this.dateToday;
    this.updateShowAttachmentDeliveryDeadlineHint();
  }

  public async updateGenerateVotingCardsDeadline(e: string): Promise<void> {
    this.generateVotingCardsDeadlineDate = e;
    const generateVotingCardsDeadline = fromBcDate(this.generateVotingCardsDeadlineDate);
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadlineDate);
    this.validGenerateVotingCardsDeadline =
      !!printingCenterSignUpDeadline && !!generateVotingCardsDeadline && generateVotingCardsDeadline >= printingCenterSignUpDeadline;
    this.updateShowGenerateVotingCardsDeadlineHint();
  }

  public updateDeliveryToPostDeadline(e: string): void {
    this.deliveryToPostDeadlineDate = e;
    const deliveryToPostDeadline = fromBcDate(e);
    this.validDeliveryToPostDeadline = !!deliveryToPostDeadline && deliveryToPostDeadline < this.contest.date;
  }

  public updateShowPrintingCenterSignUpDeadlineHint(): void {
    if (!this.printingCenterSignUpDeadlineDate) {
      this.showPrintingCenterSignUpDeadlineHint = false;
      return;
    }

    this.showPrintingCenterSignUpDeadlineHint = this.showDeadlineHint(this.printingCenterSignUpDeadlineDate);
  }

  public updateShowGenerateVotingCardsDeadlineHint(): void {
    if (!this.generateVotingCardsDeadlineDate) {
      this.showGenerateVotingCardsDeadlineHint = false;
      return;
    }

    this.showGenerateVotingCardsDeadlineHint = this.showDeadlineHint(this.generateVotingCardsDeadlineDate);
  }

  private updateShowAttachmentDeliveryDeadlineHint(): void {
    if (!this.attachmentDeliveryDeadlineDate) {
      this.showAttachmentDeliveryDeadlineHint = false;
      return;
    }

    this.showAttachmentDeliveryDeadlineHint = this.showDeadlineHint(this.attachmentDeliveryDeadlineDate);
  }

  private showDeadlineHint(dateStr: string): boolean {
    const date = fromBcDate(dateStr)!;
    const datePlusThreeWeeks = new Date(date);
    addDays(datePlusThreeWeeks, daysBeforeTheContestForHint);

    return datePlusThreeWeeks >= this.contest.date;
  }
}

export interface ContestPrintingCenterSignUpDeadlineDialogData {
  contest: Contest;
  forPrintJobManagement: boolean;
}

export interface ContestPrintingCenterSignUpDeadlineDialogResult {
  resetGenerateVotingCardsTriggeredDomainOfInfluenceIds?: string[];
}
