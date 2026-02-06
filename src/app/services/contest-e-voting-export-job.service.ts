/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  GetContestEVotingExportJobRequest,
  RetryContestEVotingExportJobRequest,
  ContestEVotingExportJobServiceClient,
  Ech0045Version,
  UpdateAndResetContestEVotingExportJobRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { ContestEVotingExportJob } from '../models/e-voting-export-job.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContestEVotingExportJobService {
  private readonly client = inject(ContestEVotingExportJobServiceClient);

  public async retryJob(contestId: string): Promise<void> {
    await firstValueFrom(this.client.retryJob(new RetryContestEVotingExportJobRequest({ contestId })));
  }

  public async getJob(contestId: string): Promise<ContestEVotingExportJob> {
    return await firstValueFrom(this.client.getJob(new GetContestEVotingExportJobRequest({ contestId }))).then(
      x => x.toObject() as ContestEVotingExportJob,
    );
  }

  public async updateAndResetJob(contestId: string, ech0045Version: Ech0045Version): Promise<void> {
    await firstValueFrom(this.client.updateAndResetJob(new UpdateAndResetContestEVotingExportJobRequest({ contestId, ech0045Version })));
  }
}
