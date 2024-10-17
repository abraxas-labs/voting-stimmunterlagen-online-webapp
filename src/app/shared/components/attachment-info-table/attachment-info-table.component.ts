/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnChanges } from '@angular/core';
import { AttachmentTableEntry } from '../../../models/attachment.model';
import { isAttachment, showRequiredForVoterListsCount } from '../../../services/utils/attachment.utils';

@Component({
  selector: 'app-attachment-info-table',
  templateUrl: './attachment-info-table.component.html',
  styleUrls: ['./attachment-info-table.component.scss'],
})
export class AttachmentInfoTableComponent implements OnChanges {
  public columns: string[] = [];

  @Input()
  public entries: AttachmentTableEntry[] = [];

  @Input()
  public hideRequiredCount = false;

  public ngOnChanges(): void {
    this.columns = [
      'category',
      'name',
      'orderedCount',
      'requiredForVoterListsCount',
      'color',
      'format',
      'supplier',
      'deliveryPlannedOn',
      'deliveryReceivedOn',
      'station',
      'state',
    ];

    if (!this.hideRequiredCount) {
      this.columns.splice(3, 0, 'requiredCount');
    }
  }

  public readonly isAttachment = isAttachment;
  public readonly showRequiredForVoterListsCount = showRequiredForVoterListsCount;
}
