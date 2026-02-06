/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit, inject } from '@angular/core';
import { AdditionalInvoicePosition, AdditionalInvoicePositionAvailableMaterial } from '../../../models/additional-invoice-position.model';
import { DomainOfInfluence } from '../../../models/domain-of-influence.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdditionalInvoicePositionService } from '../../../services/additional-invoice-position.service';
import { ToastService } from '../../../services/toast.service';
import { IamService } from '../../../services/iam.service';

@Component({
  selector: 'app-additional-invoice-position-edit-dialog',
  templateUrl: './additional-invoice-position-edit-dialog.component.html',
  standalone: false,
})
export class AdditionalInvoicePositionEditDialogComponent implements OnInit {
  public readonly data = inject<AdditionalInvoicePositionEditDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef =
    inject<MatDialogRef<AdditionalInvoicePositionEditDialogComponent, AdditionalInvoicePositionEditDialogResult>>(MatDialogRef);
  private readonly additionalInvoicePositionService = inject(AdditionalInvoicePositionService);
  private readonly toast = inject(ToastService);
  private readonly iam = inject(IamService);

  public readonly domainOfInfluences: DomainOfInfluence[];
  public readonly additionalInvoicePosition!: AdditionalInvoicePosition;
  public readonly isNew: boolean = false;
  public readonly availableMaterials: AdditionalInvoicePositionAvailableMaterial[];
  public saving: boolean = false;
  public deleting: boolean = false;
  public validAmount: boolean = false;
  public showComment: boolean = false;

  constructor() {
    this.isNew = !this.data.additionalInvoicePosition.id;
    this.additionalInvoicePosition = this.data.additionalInvoicePosition;
    this.domainOfInfluences = this.data.selectableDomainOfInfluences;
    this.availableMaterials = this.data.availableMaterials;

    if (this.isNew) {
      return;
    }

    const selectedDoi = this.domainOfInfluences.find(doi => doi.id == this.additionalInvoicePosition.domainOfInfluence.id);

    if (!!selectedDoi) {
      this.additionalInvoicePosition.domainOfInfluence = selectedDoi;
    } else {
      this.domainOfInfluences = [this.additionalInvoicePosition.domainOfInfluence, ...this.domainOfInfluences];
    }
  }

  public ngOnInit(): void {
    this.updateValidAmount();
    this.updateShowComment();
  }

  public async save(): Promise<void> {
    this.saving = true;
    try {
      if (this.isNew) {
        this.additionalInvoicePosition.id = await this.additionalInvoicePositionService.create(this.additionalInvoicePosition);
        this.additionalInvoicePosition.createdBy = await this.iam.getUser();
        this.additionalInvoicePosition.created = new Date();
      } else {
        await this.additionalInvoicePositionService.update(this.additionalInvoicePosition);
      }

      this.toast.saved();
      this.done(this.additionalInvoicePosition);
    } finally {
      this.saving = false;
    }
  }

  public async delete(): Promise<void> {
    this.deleting = true;
    try {
      await this.additionalInvoicePositionService.delete(this.additionalInvoicePosition.id);
      this.toast.deleted();
      this.done(this.additionalInvoicePosition, true);
    } finally {
      this.deleting = false;
    }
  }

  public done(additionalInvoicePosition?: AdditionalInvoicePosition, deleted?: boolean): void {
    if (!!additionalInvoicePosition) {
      this.dialogRef.close({
        additionalInvoicePosition,
        deleted,
      });
      return;
    }

    this.dialogRef.close();
  }

  public updateValidAmount(): void {
    this.validAmount = this.additionalInvoicePosition.amount > 0 && (this.additionalInvoicePosition.amount * 100) % 25 === 0;
  }

  public updateMaterialNumber(e: any) {
    this.additionalInvoicePosition.materialNumber = e;
    this.updateShowComment();
  }

  private updateShowComment(): void {
    const availableMaterial = this.availableMaterials.find(m => m.number === this.additionalInvoicePosition.materialNumber);
    this.showComment = !!availableMaterial && availableMaterial.commentRequired;

    if (!this.showComment) {
      this.additionalInvoicePosition.comment = '';
    }
  }
}

export interface AdditionalInvoicePositionEditDialogData {
  availableMaterials: AdditionalInvoicePositionAvailableMaterial[];
  additionalInvoicePosition: AdditionalInvoicePosition;
  selectableDomainOfInfluences: DomainOfInfluence[];
}

export interface AdditionalInvoicePositionEditDialogResult {
  additionalInvoicePosition: AdditionalInvoicePosition;
  deleted?: boolean;
}
