/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnInit } from '@angular/core';
import { AttachmentState, AttachmentTableEntry, mapToAttachmentTableEntries } from '../../../../models/attachment.model';
import { Contest } from '../../../../models/contest.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { AttachmentFilter } from '../../attachment-filter/attachment-filter.component';

@Component({
  selector: 'app-contest-overview-attachment-tab-content',
  templateUrl: './contest-overview-attachment-tab-content.component.html',
  styleUrls: ['./contest-overview-attachment-tab-content.component.scss'],
})
export class ContestOverviewAttachmentTabContentComponent implements OnInit {
  public loading = true;
  public attachmentTableEntries: AttachmentTableEntry[] = [];

  @Input()
  public contest!: Contest;

  @Input()
  public forPrintJobManagement = false;

  constructor(private readonly attachmentService: AttachmentService) {}

  public ngOnInit(): Promise<void> {
    return this.loadAttachments();
  }

  public async loadAttachments(filter?: AttachmentFilter): Promise<void> {
    this.loading = true;

    try {
      this.attachmentTableEntries = mapToAttachmentTableEntries(
        await this.attachmentService.listCategorySummariesForPrintJobManagement(
          this.contest.id,
          filter?.state ?? AttachmentState.ATTACHMENT_STATE_UNSPECIFIED,
          filter?.query ?? '',
        ),
      );
    } finally {
      this.loading = false;
    }
  }
}
