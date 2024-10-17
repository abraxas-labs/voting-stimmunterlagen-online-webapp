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
import { PrintJobSetNextStateDialogData } from '../print-job-set-next-state-dialog/print-job-set-next-state-dialog.component';

@Component({
  selector: 'app-print-job-reset-state-dialog',
  templateUrl: './print-job-reset-state-dialog.component.html',
  styleUrls: ['./print-job-reset-state-dialog.component.scss'],
})
export class PrintJobResetStateDialogComponent {
  public printJob: PrintJob;
  public saving = false;

  constructor(
    private readonly dialogRef: MatDialogRef<PrintJobResetStateDialogComponent>,
    private readonly printJobService: PrintJobService,
    private readonly toast: ToastService,
    @Inject(MAT_DIALOG_DATA) public data: PrintJobSetNextStateDialogData,
  ) {
    this.printJob = data.printJob;
  }

  public async save(): Promise<void> {
    this.saving = true;
    try {
      await this.printJobService.resetState(this.printJob.domainOfInfluence.id);

      if (this.printJob.state === PrintJobState.PRINT_JOB_STATE_PROCESS_STARTED) {
        this.printJob.processStartedOn = undefined;
      } else if (this.printJob.state === PrintJobState.PRINT_JOB_STATE_PROCESS_ENDED) {
        this.printJob.processEndedOn = undefined;
      } else {
        this.printJob.doneOn = undefined;
      }

      this.printJob.state -= 1;
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

export interface PrintJobResetStateDialogData {
  printJob: PrintJob;
}
