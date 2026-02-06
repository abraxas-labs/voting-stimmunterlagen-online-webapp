/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { SegmentedControl } from '@abraxas/base-components';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { PrintJobState } from '../../../models/print-job.model';
import { EnumUtil } from '../../../services/enum.util';

@Component({
  selector: 'app-print-job-filter',
  templateUrl: './print-job-filter.component.html',
  styleUrls: ['./print-job-filter.component.scss'],
  standalone: false,
})
export class PrintJobFilterComponent {
  public readonly stateItems: SegmentedControl[];

  public filter: PrintJobFilter = {
    state: PrintJobState.PRINT_JOB_STATE_UNSPECIFIED,
    query: '',
  };

  @Output()
  public filterChange: EventEmitter<PrintJobFilter> = new EventEmitter<PrintJobFilter>();

  constructor() {
    const enumUtil = inject(EnumUtil);

    this.stateItems = enumUtil
      .getArrayWithDescriptionsWithUnspecified(PrintJobState, 'PRINT_JOB.FILTER_STATES.')
      .map(x => ({ displayText: x.description, value: x.value, disabled: false }));
  }

  public stateChange(state: PrintJobState): void {
    if (this.filter.state === state) {
      return;
    }

    this.filter.state = state;
    this.emitFilterChange();
  }

  public emitFilterChange(): void {
    this.filterChange.emit(this.filter);
  }
}

export interface PrintJobFilter {
  state: PrintJobState;
  query: string;
}
