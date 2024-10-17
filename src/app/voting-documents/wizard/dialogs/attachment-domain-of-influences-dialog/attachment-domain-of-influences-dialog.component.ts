/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Attachment } from '../../../../models/attachment.model';
import { CheckableItem } from '../../../../models/checkable-item.model';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { AttachmentService } from '../../../../services/attachment.service';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-attachment-domain-of-influences-dialog',
  templateUrl: './attachment-domain-of-influences-dialog.component.html',
  styleUrls: ['./attachment-domain-of-influences-dialog.component.scss'],
})
export class AttachmentDomainOfInfluencesDialogComponent implements OnInit {
  private readonly attachment: Attachment;

  public saving = false;
  public loading = true;
  public checkableDomainOfInfluences: CheckableItem<DomainOfInfluence>[] = [];

  public readonly columns = ['name', 'approved'];

  constructor(
    private readonly dialogRef: MatDialogRef<AttachmentDomainOfInfluencesDialogComponent>,
    private readonly attachmentService: AttachmentService,
    private readonly toast: ToastService,
    private readonly domainOfInfluenceService: DomainOfInfluenceService,
    public readonly cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: AttachmentDomainOfInfluencesDialogData,
  ) {
    this.attachment = data.attachment;
  }

  public async ngOnInit(): Promise<void> {
    try {
      const dois = await this.domainOfInfluenceService.listChildren(this.attachment.domainOfInfluence.id);
      const doiAttachmentCounts = await this.attachmentService.listDomainOfInfluenceAttachmentCounts(this.attachment.id);

      this.checkableDomainOfInfluences = dois.map(doi => ({
        checked: !!doiAttachmentCounts.find(c => c.domainOfInfluence.id === doi.id),
        item: doi,
      }));
    } finally {
      this.loading = false;
    }
  }

  public async save(): Promise<void> {
    if (this.checkableDomainOfInfluences.length === 0) {
      this.done();
      return;
    }

    this.saving = true;
    try {
      const checkedDoiIds = this.checkableDomainOfInfluences.filter(c => c.checked).map(c => c.item.id);
      await this.attachmentService.updateDomainOfInfluenceAttachmentEntries(this.attachment.id, checkedDoiIds);
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

export interface AttachmentDomainOfInfluencesDialogData {
  attachment: Attachment;
}
