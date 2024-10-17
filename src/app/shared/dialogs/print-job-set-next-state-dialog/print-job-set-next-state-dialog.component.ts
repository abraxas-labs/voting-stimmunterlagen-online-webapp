/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrintJob, PrintJobState } from '../../../models/print-job.model';
import { PrintJobService } from '../../../services/print-job.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-print-job-set-next-state-dialog',
  templateUrl: './print-job-set-next-state-dialog.component.html',
  styleUrls: ['./print-job-set-next-state-dialog.component.scss'],
})
export class PrintJobSetNextStateDialogComponent {
  public readonly printJob!: PrintJob;
  public saving = false;
  public votingCardsPrintedAndPackedCount?: number;
  public votingCardsShipmentWeight?: number;
  public comment = '';
  public readonly nextStateTranslationPrefix: string;
  public readonly printJobStates = PrintJobState;

  constructor(
    private readonly dialogRef: MatDialogRef<PrintJobSetNextStateDialogComponent>,
    private readonly printJobService: PrintJobService,
    private readonly toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: PrintJobSetNextStateDialogData,
  ) {
    this.printJob = data.printJob;
    this.nextStateTranslationPrefix = 'PRINT_JOB.SET_STATE.NEXT_STATE.' + this.printJob.state;
  }

  public async save(): Promise<void> {
    this.saving = true;
    const now = new Date();
    try {
      if (this.printJob.state === PrintJobState.PRINT_JOB_STATE_READY_FOR_PROCESS) {
        await this.printJobService.setProcessStarted(this.printJob.domainOfInfluence.id);
        this.printJob.processStartedOn = now;
      } else if (this.printJob.state === PrintJobState.PRINT_JOB_STATE_PROCESS_STARTED) {
        await this.printJobService.setProcessEnded(
          this.printJob.domainOfInfluence.id,
          this.votingCardsPrintedAndPackedCount!,
          this.votingCardsShipmentWeight!,
        );
        this.printJob.processEndedOn = now;
      } else {
        await this.printJobService.setDone(this.printJob.domainOfInfluence.id, this.comment);
        this.printJob.doneOn = now;
      }

      this.printJob.state += 1;
      this.toast.saved();
      this.done();
    } finally {
      this.saving = false;
    }
  }

  public done(): void {
    this.dialogRef.close();
  }
}

export interface PrintJobSetNextStateDialogData {
  printJob: PrintJob;
}
