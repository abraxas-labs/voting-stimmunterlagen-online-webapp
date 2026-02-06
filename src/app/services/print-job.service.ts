/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  PrintJobServiceClient,
  GetPrintJobRequest,
  ResetPrintJobStateRequest,
  SetPrintJobProcessStartedRequest,
  SetPrintJobProcessEndedRequest,
  SetPrintJobDoneRequest,
  ListPrintJobGenerateVotingCardsTriggeredRequest,
  ListPrintJobSummariesRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { mapPrintJobs, mapPrintJob, PrintJob, PrintJobState, PrintJobSummary, mapPrintJobSummaries } from '../models/print-job.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PrintJobService {
  private readonly client = inject(PrintJobServiceClient);

  public listSummaries(contestId: string, state?: PrintJobState, query?: string): Promise<PrintJobSummary[]> {
    return firstValueFrom(
      this.client.listSummaries(
        new ListPrintJobSummariesRequest({
          state,
          contestId,
          query,
        }),
      ),
    ).then(x => mapPrintJobSummaries(x));
  }

  public listGenerateVotingCardsTriggered(contestId: string): Promise<PrintJob[]> {
    return firstValueFrom(
      this.client.listGenerateVotingCardsTriggered(
        new ListPrintJobGenerateVotingCardsTriggeredRequest({
          contestId,
        }),
      ),
    ).then(x => mapPrintJobs(x));
  }

  public get(domainOfInfluenceId: string): Promise<PrintJob> {
    return firstValueFrom(
      this.client.get(
        new GetPrintJobRequest({
          domainOfInfluenceId,
        }),
      ),
    ).then(x => mapPrintJob(x));
  }

  public async resetState(domainOfInfluenceId: string): Promise<void> {
    await firstValueFrom(
      this.client.resetState(
        new ResetPrintJobStateRequest({
          domainOfInfluenceId,
        }),
      ),
    );
  }

  public async setProcessStarted(domainOfInfluenceId: string): Promise<void> {
    await firstValueFrom(
      this.client.setProcessStarted(
        new SetPrintJobProcessStartedRequest({
          domainOfInfluenceId,
        }),
      ),
    );
  }

  public async setProcessEnded(
    domainOfInfluenceId: string,
    votingCardsPrintedAndPackedCount: number,
    votingCardsShipmentWeight: number,
  ): Promise<void> {
    await firstValueFrom(
      this.client.setProcessEnded(
        new SetPrintJobProcessEndedRequest({
          domainOfInfluenceId,
          votingCardsPrintedAndPackedCount,
          votingCardsShipmentWeight,
        }),
      ),
    );
  }

  public async setDone(domainOfInfluenceId: string, comment: string): Promise<void> {
    await firstValueFrom(
      this.client.setDone(
        new SetPrintJobDoneRequest({
          domainOfInfluenceId,
          comment,
        }),
      ),
    );
  }
}
