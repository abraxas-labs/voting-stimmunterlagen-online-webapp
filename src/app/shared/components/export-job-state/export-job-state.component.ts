/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ExportJobState } from '../../../models/export-job-state.model';

type ForegroundColor = 'dark' | 'light';

@Component({
  selector: 'app-export-job-state',
  templateUrl: './export-job-state.component.html',
  styleUrls: ['./export-job-state.component.scss'],
})
export class ExportJobStateComponent {
  public stateValue: ExportJobState = ExportJobState.EXPORT_JOB_STATE_READY_TO_RUN;

  public backgroundColor = '';
  public foregroundColor: ForegroundColor = 'light';

  @Input()
  public set state(s: ExportJobState) {
    this.stateValue = s;
    this.backgroundColor = this.getBackgroundColor(s);
    this.foregroundColor = this.getForegroundColor(s);
  }

  private getForegroundColor(s: ExportJobState): ForegroundColor {
    switch (s) {
      case ExportJobState.EXPORT_JOB_STATE_COMPLETED:
        return 'light';
      default:
        return 'dark';
    }
  }

  private getBackgroundColor(s: ExportJobState): string {
    switch (s) {
      case ExportJobState.EXPORT_JOB_STATE_READY_TO_RUN:
        return '#c0c0c0';
      case ExportJobState.EXPORT_JOB_STATE_RUNNING:
        return '#c2d200';
      case ExportJobState.EXPORT_JOB_STATE_COMPLETED:
        return '#1c9048';
      case ExportJobState.EXPORT_JOB_STATE_FAILED:
        return '#ff7171';
      default:
        return '#fff';
    }
  }
}
