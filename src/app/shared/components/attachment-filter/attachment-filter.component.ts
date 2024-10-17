/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { SegmentedControl } from '@abraxas/base-components/lib/components/formfields/segmented-control-group/segmented-control.model';
import { Component, EventEmitter, Output } from '@angular/core';
import { AttachmentState } from '../../../models/attachment.model';
import { EnumUtil } from '../../../services/enum.util';

@Component({
  selector: 'app-attachment-filter',
  templateUrl: './attachment-filter.component.html',
  styleUrls: ['./attachment-filter.component.scss'],
})
export class AttachmentFilterComponent {
  public readonly stateItems: SegmentedControl[];

  public filter: AttachmentFilter = {
    state: AttachmentState.ATTACHMENT_STATE_UNSPECIFIED,
    query: '',
  };

  @Output()
  public filterChange: EventEmitter<AttachmentFilter> = new EventEmitter<AttachmentFilter>();

  constructor(enumUtil: EnumUtil) {
    this.stateItems = enumUtil
      .getArrayWithDescriptionsWithUnspecified(AttachmentState, 'ATTACHMENT.STATES.')
      .map(x => ({ displayText: x.description, value: x.value, disabled: false }));
  }

  public stateChange(state: AttachmentState): void {
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

export interface AttachmentFilter {
  state: AttachmentState;
  query: string;
}
