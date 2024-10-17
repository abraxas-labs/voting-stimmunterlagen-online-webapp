/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PropertyRefresherService } from '../../../services/property-refresher.service';
import { CheckableItems } from '../../../models/checkable-item.model';
import { Contest, refreshContestDeadlineStates } from '../../../models/contest.model';
import { PrintJob } from '../../../models/print-job.model';
import { ContestService } from '../../../services/contest.service';
import { PrintJobService } from '../../../services/print-job.service';
import { ToastService } from '../../../services/toast.service';
import { addDays, fromBcDate } from '../../../services/utils/date.utils';

const daysBeforeTheContestForHint = 21;

@Component({
  selector: 'app-contest-printing-center-sign-up-deadline-dialog',
  templateUrl: './contest-printing-center-sign-up-deadline-dialog.component.html',
  styleUrls: ['./contest-printing-center-sign-up-deadline-dialog.component.scss'],
})
export class ContestPrintingCenterSignUpDeadlineDialogComponent implements OnInit {
  public readonly columns = ['checkbox', 'authority', 'domainOfInfluence'];
  public readonly contest!: Contest;

  public saving = false;
  public checkablePrintJobs: CheckableItems<PrintJob> = new CheckableItems<PrintJob>([]);
  public printingCenterSignUpDeadline?: string;
  public generateVotingCardsDeadline?: string;
  public showPrintingCenterSignUpDeadlineHint = false;
  public showGenerateVotingCardsDeadlineHint = false;
  public validPrintingCenterSignUpDeadline = false;
  public validGenerateVotingCardsDeadline = false;

  private readonly dateToday = fromBcDate(new Date().toISOString().split('T')[0])!;

  constructor(
    private readonly dialogRef: MatDialogRef<ContestPrintingCenterSignUpDeadlineDialogComponent>,
    private readonly contestService: ContestService,
    private readonly printJobService: PrintJobService,
    private readonly toast: ToastService,
    private readonly propertyRefresher: PropertyRefresherService,
    @Inject(MAT_DIALOG_DATA) public data: ContestPrintingCenterSignUpDeadlineDialogData,
  ) {
    this.contest = data.contest;
  }

  public async ngOnInit(): Promise<void> {
    const printJobs = await this.printJobService.listGenerateVotingCardsTriggered(this.contest.id);
    this.checkablePrintJobs = new CheckableItems(printJobs.map(p => ({ item: p, checked: false })));
  }

  public async save(): Promise<void> {
    try {
      const printingCenterSignUpDeadlineDate = fromBcDate(this.printingCenterSignUpDeadline)!;
      const generateVotingCardsDeadlineDate = fromBcDate(this.generateVotingCardsDeadline)!;
      const resetGenerateVotingCardsTriggeredDomainOfInfluenceIds = this.checkablePrintJobs.checkedItems.map(v => v.domainOfInfluence.id);

      this.saving = true;

      await this.contestService.updatePrintingCenterSignUpDeadline(
        this.contest.id,
        printingCenterSignUpDeadlineDate,
        generateVotingCardsDeadlineDate,
        resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
      );

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
    this.printingCenterSignUpDeadline = e;
    await this.updateValidPrintingCenterSignUpDeadline();
    this.updateShowPrintingCenterSignUpDeadlineHint();
  }

  public async updateGenerateVotingCardsDeadline(e: string): Promise<void> {
    this.generateVotingCardsDeadline = e;
    await this.updateValidGenerateVotingCardsDeadline();
    this.updateShowGenerateVotingCardsDeadlineHint();
  }

  public updateShowPrintingCenterSignUpDeadlineHint(): void {
    if (!this.printingCenterSignUpDeadline) {
      this.showPrintingCenterSignUpDeadlineHint = false;
      return;
    }

    this.showPrintingCenterSignUpDeadlineHint = this.showDeadlineHint(this.printingCenterSignUpDeadline);
  }

  public updateShowGenerateVotingCardsDeadlineHint(): void {
    if (!this.generateVotingCardsDeadline) {
      this.showGenerateVotingCardsDeadlineHint = false;
      return;
    }

    this.showGenerateVotingCardsDeadlineHint = this.showDeadlineHint(this.generateVotingCardsDeadline);
  }

  private async updateValidPrintingCenterSignUpDeadline(): Promise<void> {
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadline)!;
    await this.propertyRefresher.updateBooleanProperty(
      this,
      'validPrintingCenterSignUpDeadline',
      printingCenterSignUpDeadline > this.dateToday,
    );
  }

  private async updateValidGenerateVotingCardsDeadline(): Promise<void> {
    const generateVotingCardsDeadline = fromBcDate(this.generateVotingCardsDeadline)!;
    const printingCenterSignUpDeadline = fromBcDate(this.printingCenterSignUpDeadline);
    await this.propertyRefresher.updateBooleanProperty(
      this,
      'validGenerateVotingCardsDeadline',
      !!printingCenterSignUpDeadline && generateVotingCardsDeadline >= printingCenterSignUpDeadline,
    );
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
}

export interface ContestPrintingCenterSignUpDeadlineDialogResult {
  resetGenerateVotingCardsTriggeredDomainOfInfluenceIds?: string[];
}
