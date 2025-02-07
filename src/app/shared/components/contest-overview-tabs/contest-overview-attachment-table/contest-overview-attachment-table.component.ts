/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnChanges } from '@angular/core';
import { Attachment, AttachmentTableEntry } from '../../../../models/attachment.model';
import { DialogService } from '../../../../services/dialog.service';
import { isAttachment, showRequiredForVoterListsCount } from '../../../../services/utils/attachment.utils';
import { AttachmentStateDialogComponent, AttachmentStateDialogData } from '../../attachment-state-dialog/attachment-state-dialog.component';
import {
  AttachmentStationDialogComponent,
  AttachmentStationDialogData,
} from '../../attachment-station-dialog/attachment-station-dialog.component';

@Component({
  selector: 'app-contest-overview-attachment-table',
  templateUrl: './contest-overview-attachment-table.component.html',
  styleUrls: ['./contest-overview-attachment-table.component.scss'],
})
export class ContestOverviewAttachmentTableComponent implements OnChanges {
  public columns: string[] = [];

  @Input()
  public entries: AttachmentTableEntry[] = [];

  @Input()
  public forPrintJobManagement = false;

  constructor(private readonly dialog: DialogService) {}

  public readonly isAttachment = isAttachment;
  public readonly showRequiredForVoterListsCount = showRequiredForVoterListsCount;

  public async setStation(attachment: Attachment): Promise<void> {
    const data: AttachmentStationDialogData = {
      attachment,
      otherDomainOfInfluenceAttachments: this.getAttachments().filter(
        a => a.id !== attachment.id && a.domainOfInfluence.id === attachment.domainOfInfluence.id,
      ),
    };

    await this.dialog.openForResult(AttachmentStationDialogComponent, data);
  }

  public async setState(attachment: Attachment): Promise<void> {
    const data: AttachmentStateDialogData = {
      attachment,
    };

    await this.dialog.openForResult(AttachmentStateDialogComponent, data);
  }

  public ngOnChanges(): void {
    this.columns = [
      'category',
      'authority',
      'domainOfInfluence',
      'name',
      'orderedCount',
      'requiredCount',
      'requiredForVoterListsCount',
      'format',
      'color',
      'supplier',
      'deliveryPlannedOn',
      'deliveryReceivedOn',
      'station',
      'state',
    ];

    if (this.forPrintJobManagement) {
      this.columns.splice(this.columns.length, 0, 'stateChange');
    }
  }

  private getAttachments(): Attachment[] {
    return this.entries.filter(isAttachment) as Attachment[];
  }
}
