/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ContestVotingCardLayoutServiceClient,
  GetContestVotingCardLayoutPdfPreviewRequest,
  GetContestVotingCardLayoutsRequest,
  GetContestVotingCardLayoutTemplatesRequest,
  SetContestVotingCardLayoutRequest,
  VotingCardType,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { ContestVotingCardLayout } from '../models/contest-voting-card-layout.model';
import { Template } from '../models/template.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContestVotingCardLayoutService {
  constructor(private readonly client: ContestVotingCardLayoutServiceClient) {}

  public getLayouts(contestId: string): Promise<ContestVotingCardLayout[]> {
    return firstValueFrom(this.client.getLayouts(new GetContestVotingCardLayoutsRequest({ contestId }))).then(
      x => x.toObject().layouts as ContestVotingCardLayout[],
    );
  }

  public getTemplates(contestId: string): Promise<Template[]> {
    return firstValueFrom(this.client.getTemplates(new GetContestVotingCardLayoutTemplatesRequest({ contestId }))).then(
      x => x.toObject().templates as Template[],
    );
  }

  public getPdfPreview(contestId: string, votingCardType: VotingCardType): Promise<Uint8Array> {
    return firstValueFrom(this.client.getPdfPreview(new GetContestVotingCardLayoutPdfPreviewRequest({ contestId, votingCardType }))).then(
      x => x.pdf!,
    );
  }

  public async setLayout(contestId: string, layout: ContestVotingCardLayout): Promise<void> {
    await firstValueFrom(
      this.client.setLayout(new SetContestVotingCardLayoutRequest({ ...layout, templateId: layout.template!.id, contestId })),
    );
  }
}
