/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { FileDownloadService } from '@abraxas/voting-lib';
import { Injectable, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GenerateVotingExportRequest } from '../models/voting-export.model';

@Injectable({
  providedIn: 'root',
})
export class VotingExportService {
  private readonly fileDownloadService = inject(FileDownloadService);

  private readonly restApiUrl = `${environment.restApiEndpoint}/voting-export`;

  public async downloadExport(key: string, contestId: string, domainOfInfluenceId: string, voterListId?: string): Promise<void> {
    const req: GenerateVotingExportRequest = {
      key,
      contestId,
      domainOfInfluenceId,
      voterListId,
    };

    await this.fileDownloadService.postDownloadFile(this.restApiUrl, req);
  }
}
