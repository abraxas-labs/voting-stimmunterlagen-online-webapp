/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, inject } from '@angular/core';
import {
  AdditionalInvoicePosition,
  AdditionalInvoicePositionAvailableMaterial,
  newAdditionalInvoicePosition,
} from '../../../../models/additional-invoice-position.model';
import { DialogService } from '../../../../services/dialog.service';
import { cloneDeep } from 'lodash';
import {
  AdditionalInvoicePositionEditDialogComponent,
  AdditionalInvoicePositionEditDialogData,
  AdditionalInvoicePositionEditDialogResult,
} from '../../additional-invoice-position-edit-dialog/additional-invoice-position-edit-dialog.component';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';

@Component({
  selector: 'app-contest-overview-additional-invoice-position-table',
  templateUrl: './contest-overview-additional-invoice-position-table.component.html',
  standalone: false,
})
export class ContestOverviewAdditionalInvoicePositionTableComponent {
  private readonly dialog = inject(DialogService);

  public readonly columns = ['authority', 'domainOfInfluence', 'description', 'amount', 'createdBy', 'created'];

  @Input()
  public additionalInvoicePositions: AdditionalInvoicePosition[] = [];

  @Input()
  public availableMaterials: AdditionalInvoicePositionAvailableMaterial[] = [];

  @Input()
  public selectableDomainOfInfluences: DomainOfInfluence[] = [];

  public async createOrEdit(additionalInvoicePosition?: AdditionalInvoicePosition): Promise<void> {
    additionalInvoicePosition = !additionalInvoicePosition ? newAdditionalInvoicePosition() : cloneDeep(additionalInvoicePosition);

    const dialogData: AdditionalInvoicePositionEditDialogData = {
      additionalInvoicePosition,
      availableMaterials: this.availableMaterials,
      selectableDomainOfInfluences: this.selectableDomainOfInfluences,
    };

    this.handleEditDialogResult(await this.dialog.openForResult(AdditionalInvoicePositionEditDialogComponent, dialogData));
  }

  private handleEditDialogResult(result?: AdditionalInvoicePositionEditDialogResult): void {
    if (!result) {
      return;
    }

    const additionalInvoicePosition = result.additionalInvoicePosition;
    additionalInvoicePosition.material = this.availableMaterials.find(m => m.number === additionalInvoicePosition.materialNumber);

    if (result.deleted) {
      this.additionalInvoicePositions = this.additionalInvoicePositions.filter(x => x.id !== additionalInvoicePosition.id);
      return;
    }

    const existingIndex = this.additionalInvoicePositions.findIndex(a => a.id === additionalInvoicePosition.id);

    if (existingIndex < 0) {
      this.additionalInvoicePositions = [...this.additionalInvoicePositions, additionalInvoicePosition];
      this.refreshAdditionalInvoicePositions();
      return;
    }

    this.additionalInvoicePositions[existingIndex] = additionalInvoicePosition;
    this.refreshAdditionalInvoicePositions();
  }

  private refreshAdditionalInvoicePositions(): void {
    this.additionalInvoicePositions.sort((a, b) => a.domainOfInfluence.name.localeCompare(b.domainOfInfluence.name));

    // explicit cd trigger, since cd does not work for single objects in arrays.
    this.additionalInvoicePositions = [...this.additionalInvoicePositions];
  }
}
