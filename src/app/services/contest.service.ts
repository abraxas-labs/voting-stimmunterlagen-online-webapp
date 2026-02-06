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
  ResetGenerateVotingCardsAndUpdateContestDeadlinesRequest,
  ResetGenerateVotingCardsAndUpdateCommunalContestDeadlinesRequest,
  SetContestDeadlinesRequest,
  SetCommunalContestDeadlinesRequest,
  GetPreviewCommunalDeadlinesRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { Timestamp } from '@ngx-grpc/well-known-types';
import { CommunalContestDeadlinesCalculationResult, Contest, mapContest, mapContests } from '../models/contest.model';
import { firstValueFrom } from 'rxjs';
import { newUTCDate } from './utils/date.utils';

@Injectable({
  providedIn: 'root',
})
export class ContestService {
  private readonly client = inject(ContestServiceClient);

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
    electoralRegisterEVotingFrom?: Date,
  ): Promise<void> {
    await firstValueFrom(
      this.client.setDeadlines(
        new SetContestDeadlinesRequest({
          id,
          printingCenterSignUpDeadlineDate: Timestamp.fromDate(printingCenterSignUpDeadlineDate),
          attachmentDeliveryDeadlineDate: Timestamp.fromDate(attachmentDeliveryDeadlineDate),
          generateVotingCardsDeadlineDate: Timestamp.fromDate(generateVotingCardsDeadlineDate),
          electoralRegisterEVotingFromDate: !!electoralRegisterEVotingFrom ? Timestamp.fromDate(electoralRegisterEVotingFrom) : undefined,
        }),
      ),
    );
  }

  public async getPreviewCommunalDeadlines(
    id: string,
    deliveryToPostDeadlineDate: Date,
  ): Promise<CommunalContestDeadlinesCalculationResult> {
    const response = await firstValueFrom(
      this.client.getPreviewCommunalDeadlines(
        new GetPreviewCommunalDeadlinesRequest({
          id,
          deliveryToPostDeadlineDate: Timestamp.fromDate(deliveryToPostDeadlineDate),
        }),
      ),
    );

    return {
      attachmentDeliveryDeadlineDate: newUTCDate(response.attachmentDeliveryDeadline!.toDate()),
      deliveryToPostDeadlineDate: newUTCDate(response.deliveryToPostDeadline!.toDate()),
      generateVotingCardsDeadlineDate: newUTCDate(response.generateVotingCardsDeadline!.toDate()),
      printingCenterSignUpDeadlineDate: newUTCDate(response.printingCenterSignUpDeadline!.toDate()),
    };
  }

  public async setCommunalDeadlines(id: string, deliveryToPostDeadlineDate: Date): Promise<CommunalContestDeadlinesCalculationResult> {
    const response = await firstValueFrom(
      this.client.setCommunalDeadlines(
        new SetCommunalContestDeadlinesRequest({
          id,
          deliveryToPostDeadlineDate: Timestamp.fromDate(deliveryToPostDeadlineDate),
        }),
      ),
    );

    return {
      attachmentDeliveryDeadlineDate: newUTCDate(response.attachmentDeliveryDeadline!.toDate()),
      deliveryToPostDeadlineDate: newUTCDate(response.deliveryToPostDeadline!.toDate()),
      generateVotingCardsDeadlineDate: newUTCDate(response.generateVotingCardsDeadline!.toDate()),
      printingCenterSignUpDeadlineDate: newUTCDate(response.printingCenterSignUpDeadline!.toDate()),
    };
  }

  public async resetGenerateVotingCardsAndUpdateContestDeadlines(
    id: string,
    printingCenterSignUpDeadlineDate: Date,
    generateVotingCardsDeadlineDate: Date,
    resetGenerateVotingCardsTriggeredDomainOfInfluenceIds: string[],
  ) {
    await firstValueFrom(
      this.client.resetGenerateVotingCardsAndUpdateContestDeadlines(
        new ResetGenerateVotingCardsAndUpdateContestDeadlinesRequest({
          id,
          printingCenterSignUpDeadlineDate: Timestamp.fromDate(printingCenterSignUpDeadlineDate),
          generateVotingCardsDeadlineDate: Timestamp.fromDate(generateVotingCardsDeadlineDate),
          resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
        }),
      ),
    );
  }

  public async resetGenerateVotingCardsAndUpdateCommunalContestDeadlines(
    id: string,
    printingCenterSignUpDeadlineDate: Date,
    generateVotingCardsDeadlineDate: Date,
    attachmentDeliveryDeadlineDate: Date,
    deliveryToPostDeadlineDate: Date,
    resetGenerateVotingCardsTriggeredDomainOfInfluenceIds: string[],
  ) {
    await firstValueFrom(
      this.client.resetGenerateVotingCardsAndUpdateCommunalContestDeadlines(
        new ResetGenerateVotingCardsAndUpdateCommunalContestDeadlinesRequest({
          id,
          printingCenterSignUpDeadlineDate: Timestamp.fromDate(printingCenterSignUpDeadlineDate),
          generateVotingCardsDeadlineDate: Timestamp.fromDate(generateVotingCardsDeadlineDate),
          attachmentDeliveryDeadlineDate: Timestamp.fromDate(attachmentDeliveryDeadlineDate),
          deliveryToPostDeadlineDate: Timestamp.fromDate(deliveryToPostDeadlineDate),
          resetGenerateVotingCardsTriggeredDomainOfInfluenceIds,
        }),
      ),
    );
  }
}
