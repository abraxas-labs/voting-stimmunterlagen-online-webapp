/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ListVotingCardGeneratorJobsRequest,
  RetryVotingCardGeneratorJobsRequest,
  VotingCardGeneratorJobsServiceClient,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { VotingCardGeneratorJob } from '../models/voting-card-generator-job.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VotingCardGeneratorJobService {
  private readonly client = inject(VotingCardGeneratorJobsServiceClient);

  public async retryJobs(domainOfInfluenceId: string): Promise<void> {
    await firstValueFrom(this.client.retryJobs(new RetryVotingCardGeneratorJobsRequest({ domainOfInfluenceId })));
  }

  public async listJobs(domainOfInfluenceId: string): Promise<VotingCardGeneratorJob[]> {
    return await firstValueFrom(this.client.listJobs(new ListVotingCardGeneratorJobsRequest({ domainOfInfluenceId }))).then(
      x => (x.toObject().jobs as VotingCardGeneratorJob[]) ?? [],
    );
  }
}
