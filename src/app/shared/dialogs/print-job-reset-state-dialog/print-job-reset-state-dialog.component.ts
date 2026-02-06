/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrintJob, PrintJobState } from '../../../models/print-job.model';
import { PrintJobService } from '../../../services/print-job.service';
import { ToastService } from '../../../services/toast.service';
import { PrintJobSetNextStateDialogData } from '../print-job-set-next-state-dialog/print-job-set-next-state-dialog.component';

@Component({
  selector: 'app-print-job-reset-state-dialog',
  templateUrl: './print-job-reset-state-dialog.component.html',
  styleUrls: ['./print-job-reset-state-dialog.component.scss'],
  standalone: false,
})
export class PrintJobResetStateDialogComponent {
  public readonly data = inject<PrintJobSetNextStateDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<PrintJobResetStateDialogComponent>>(MatDialogRef);
  private readonly printJobService = inject(PrintJobService);
  private readonly toast = inject(ToastService);

  public printJob: PrintJob;
  public saving = false;

  constructor() {
    this.printJob = this.data.printJob;
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
