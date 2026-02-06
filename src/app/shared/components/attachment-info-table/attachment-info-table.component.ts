/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject, Input, OnChanges } from '@angular/core';
import { Attachment, AttachmentTableEntry } from '../../../models/attachment.model';
import { isAttachment, showRequiredForVoterListsCount } from '../../../services/utils/attachment.utils';
import { DialogService } from '../../../services/dialog.service';
import { Contest } from '../../../models/contest.model';
import {
  AttachmentEditDialogComponent,
  buildAttachmentEditDialogData,
} from '../../dialogs/attachment-edit-dialog/attachment-edit-dialog.component';

@Component({
  selector: 'app-attachment-info-table',
  templateUrl: './attachment-info-table.component.html',
  styleUrls: ['./attachment-info-table.component.scss'],
  standalone: false,
})
export class AttachmentInfoTableComponent implements OnChanges {
  private readonly dialog = inject(DialogService);

  public columns: string[] = [];

  @Input()
  public entries: AttachmentTableEntry[] = [];

  @Input()
  public contest!: Contest;

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

    if (!this.contest.isSingleAttendeeContest) {
      this.columns.splice(3, 0, 'requiredCount');
    }
  }

  public async open(row: AttachmentTableEntry): Promise<void> {
    if (!isAttachment(row)) {
      return;
    }

    const attachment = row as Attachment;
    const data = buildAttachmentEditDialogData(attachment, this.contest, false);
    await this.dialog.openForResult(AttachmentEditDialogComponent, data);
  }

  public isSelectionDisabled = (row: Attachment): boolean => {
    return !isAttachment(row);
  };

  public readonly isAttachment = isAttachment;
  public readonly showRequiredForVoterListsCount = showRequiredForVoterListsCount;
}
