/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  RetryVotingCardPrintFileExportJobsRequest,
  ListVotingCardPrintFileExportJobsRequest,
  VotingCardPrintFileExportJobServiceClient,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { VotingCardPrintFileExportJob } from '../models/voting-card-print-file-export-job.model';

@Injectable({
  providedIn: 'root',
})
export class VotingCardPrintFileExportJobService {
  constructor(private readonly client: VotingCardPrintFileExportJobServiceClient) {}

  public async retry(domainOfInfluenceId: string): Promise<void> {
    await firstValueFrom(this.client.retry(new RetryVotingCardPrintFileExportJobsRequest({ domainOfInfluenceId })));
  }

  public async list(domainOfInfluenceId: string): Promise<VotingCardPrintFileExportJob[]> {
    return await firstValueFrom(this.client.list(new ListVotingCardPrintFileExportJobsRequest({ domainOfInfluenceId }))).then(
      x => (x.toObject().jobs as VotingCardPrintFileExportJob[]) ?? [],
    );
  }
}
