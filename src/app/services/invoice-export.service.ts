/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FileDownloadService } from '@abraxas/voting-lib';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenerateInvoiceExportRequest } from '../models/invoice-export.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceExportService {
  private readonly fileDownloadService = inject(FileDownloadService);

  private readonly restApiUrl: string = '';

  constructor() {
    this.restApiUrl = `${environment.restApiEndpoint}/invoice-export`;
  }

  public async downloadExport(contestId: string): Promise<void> {
    const req: GenerateInvoiceExportRequest = {
      contestId,
    };

    await this.fileDownloadService.postDownloadFile(this.restApiUrl, req);
  }
}
