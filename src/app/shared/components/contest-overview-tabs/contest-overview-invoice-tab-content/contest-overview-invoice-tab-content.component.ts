/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnInit } from '@angular/core';
import { Contest } from '../../../../models/contest.model';
import { AdditionalInvoicePositionService } from '../../../../services/additional-invoice-position.service';
import {
  AdditionalInvoicePosition,
  AdditionalInvoicePositionAvailableMaterial,
} from '../../../../models/additional-invoice-position.model';
import { PrintJobService } from '../../../../services/print-job.service';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { InvoiceExportService } from '../../../../services/invoice-export.service';

@Component({
  selector: 'app-contest-overview-invoice-tab-content',
  templateUrl: './contest-overview-invoice-tab-content.component.html',
  styleUrls: ['./contest-overview-invoice-tab-content.component.scss'],
})
export class ContestOverviewInvoiceTabContentComponent implements OnInit {
  public loading = true;
  public additionalInvoicePositions: AdditionalInvoicePosition[] = [];
  public availableMaterials: AdditionalInvoicePositionAvailableMaterial[] = [];
  public domainOfInfluences: DomainOfInfluence[] = [];
  public generating = false;

  @Input()
  public contest!: Contest;

  @Input()
  public forPrintJobManagement = false;

  constructor(
    private readonly additionalPositionInvoiceService: AdditionalInvoicePositionService,
    private readonly printJobService: PrintJobService,
    private readonly invoiceExportService: InvoiceExportService,
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      this.additionalInvoicePositions = await this.additionalPositionInvoiceService.list(this.contest.id);
      this.availableMaterials = await this.additionalPositionInvoiceService.listAvailableMaterial();

      for (const additionalInvoicePosition of this.additionalInvoicePositions) {
        additionalInvoicePosition.material = this.availableMaterials.find(m => m.number === additionalInvoicePosition.materialNumber);
      }

      this.domainOfInfluences = (await this.printJobService.listSummaries(this.contest.id)).map(p => p.domainOfInfluence);
    } finally {
      this.loading = false;
    }
  }

  public async generateExport(): Promise<void> {
    this.generating = true;

    try {
      await this.invoiceExportService.downloadExport(this.contest.id);
    } finally {
      this.generating = false;
    }
  }
}
