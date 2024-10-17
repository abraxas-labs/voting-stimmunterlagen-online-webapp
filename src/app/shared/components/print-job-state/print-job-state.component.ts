/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { PrintJobState } from '../../../models/print-job.model';

@Component({
  selector: 'app-print-job-state',
  templateUrl: './print-job-state.component.html',
  styleUrls: ['./print-job-state.component.scss'],
})
export class PrintJobStateComponent {
  public stateValue: PrintJobState = PrintJobState.PRINT_JOB_STATE_UNSPECIFIED;

  public backgroundColor = '';
  public foregroundColor = 'dark';

  @Input()
  public set state(s: PrintJobState) {
    if (s === this.stateValue) {
      return;
    }

    this.stateValue = s;
    this.backgroundColor = this.getBackgroundColor(s);
  }

  private getBackgroundColor(s: PrintJobState): string {
    switch (s) {
      case PrintJobState.PRINT_JOB_STATE_EMPTY:
      case PrintJobState.PRINT_JOB_STATE_SUBMISSION_ONGOING:
      case PrintJobState.PRINT_JOB_STATE_READY_FOR_PROCESS:
        return '#e9e9e9';
      case PrintJobState.PRINT_JOB_STATE_PROCESS_STARTED:
        return '#e6eff1';
      case PrintJobState.PRINT_JOB_STATE_PROCESS_ENDED:
        return '#fff6e6';
      case PrintJobState.PRINT_JOB_STATE_DONE:
        return '#e8f4ed';
      default:
        return '#fff';
    }
  }
}
