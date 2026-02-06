/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnInit, inject } from '@angular/core';
import { AttachmentState, AttachmentTableEntry, mapToAttachmentTableEntries } from '../../../../models/attachment.model';
import { Contest } from '../../../../models/contest.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { AttachmentFilter } from '../../attachment-filter/attachment-filter.component';

@Component({
  selector: 'app-contest-overview-attachment-tab-content',
  templateUrl: './contest-overview-attachment-tab-content.component.html',
  styleUrls: ['./contest-overview-attachment-tab-content.component.scss'],
  standalone: false,
})
export class ContestOverviewAttachmentTabContentComponent implements OnInit {
  private readonly attachmentService = inject(AttachmentService);

  public loading = true;
  public attachmentTableEntries: AttachmentTableEntry[] = [];

  @Input()
  public contest!: Contest;

  @Input()
  public forPrintJobManagement = false;

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
