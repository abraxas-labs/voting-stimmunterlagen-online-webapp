/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FileDownloadService } from '@abraxas/voting-lib';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenerateVotingExportRequest } from '../models/voting-export.model';

@Injectable({
  providedIn: 'root',
})
export class VotingExportService {
  private readonly restApiUrl = `${environment.restApiEndpoint}/voting-export`;

  constructor(private readonly fileDownloadService: FileDownloadService) {}

  public async downloadExport(key: string, contestId: string, domainOfInfluenceId: string): Promise<void> {
    const req: GenerateVotingExportRequest = {
      key,
      contestId,
      domainOfInfluenceId,
    };

    await this.fileDownloadService.postDownloadFile(this.restApiUrl, req);
  }
}
