/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  GetContestEVotingExportJobRequest,
  RetryContestEVotingExportJobRequest,
  ContestEVotingExportJobServiceClient,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { ContestEVotingExportJob } from '../models/e-voting-export-job.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContestEVotingExportJobService {
  constructor(private readonly client: ContestEVotingExportJobServiceClient) {}

  public async retryJob(contestId: string): Promise<void> {
    await firstValueFrom(this.client.retryJob(new RetryContestEVotingExportJobRequest({ contestId })));
  }

  public async getJob(contestId: string): Promise<ContestEVotingExportJob> {
    return await firstValueFrom(this.client.getJob(new GetContestEVotingExportJobRequest({ contestId }))).then(
      x => x.toObject() as ContestEVotingExportJob,
    );
  }
}
