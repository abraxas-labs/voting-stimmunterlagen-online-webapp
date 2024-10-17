/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ContestServiceClient,
  ContestState,
  IdValueRequest,
  ListContestsRequest,
  SetContestDeadlinesRequest,
  UpdateContestPrintingCenterSignupDeadlineRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { Contest, mapContest, mapContests } from '../models/contest.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  constructor(private readonly client: ContestServiceClient) {}

  public get(id: string): Promise<Contest> {
    return firstValueFrom(this.client.get(new IdValueRequest({ id }))).then(x => mapContest(x));
  }

  public list(...states: ContestState[]): Promise<Contest[]> {
    return firstValueFrom(this.client.list(new ListContestsRequest({ states }))).then(x => mapContests(x));
  }

  public async setDeadlines(
    id: string,
    printingCenterSignUpDeadlineDate: Date,
    attachmentDeliveryDeadlineDate: Date,
    generateVotingCardsDeadlineDate: Date,
  ): Promise<void> {
    await firstValueFrom(
      this.client.setDeadlines(
        new SetContestDeadlinesRequest({
          id,
          printingCenterSignUpDeadlineDate: Timestamp.fromDate(printingCenterSignUpDeadlineDate),
          attachmentDeliveryDeadlineDate: Timestamp.fromDate(attachmentDeliveryDeadlineDate),
          generateVotingCardsDeadlineDate: Timestamp.fromDate(generateVotingCardsDeadlineDate),
        }),
      ),
    );
  }

  public async updatePrintingCenterSignUpDeadline(
    id: string,
    printingCenterSignUpDeadlineDate: Date,
    generateVotingCardsDeadlineDate: Date,
    resetGenerateVotingCardsTriggeredDomainOfInfluenceIds: string[],
  ) {
    await firstValueFrom(
      this.client.updatePrintingCenterSignUpDeadline(
        new UpdateContestPrintingCenterSignupDeadlineRequest({
          id,
          printingCenterSignUpDeadlineDate: Timestamp.fromDate(printingCenterSignUpDeadlineDate),
          generateVotingCardsDeadlineDate: Timestamp.fromDate(generateVotingCardsDeadlineDate),
          resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
        }),
      ),
    );
  }
}
