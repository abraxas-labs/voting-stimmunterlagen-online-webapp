/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  DomainOfInfluenceVotingCardServiceClient,
  GetDomainOfInfluenceVotingCardConfigurationRequest,
  GetDomainOfInfluenceVotingCardPdfPreviewRequest,
  SetDomainOfInfluenceVotingCardConfigurationRequest,
  VotingCardType,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { DomainOfInfluenceVotingCardConfiguration } from '../models/domain-of-influence-voting-card-configuration.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceVotingCardService {
  private readonly client = inject(DomainOfInfluenceVotingCardServiceClient);

  public getConfiguration(domainOfInfluenceId: string): Promise<DomainOfInfluenceVotingCardConfiguration> {
    return firstValueFrom(
      this.client.getConfiguration(new GetDomainOfInfluenceVotingCardConfigurationRequest({ domainOfInfluenceId })),
    ).then(x => x.toObject() as DomainOfInfluenceVotingCardConfiguration);
  }

  public async setConfiguration(configuration: DomainOfInfluenceVotingCardConfiguration): Promise<void> {
    await firstValueFrom(
      this.client.setConfiguration(
        new SetDomainOfInfluenceVotingCardConfigurationRequest({
          domainOfInfluenceId: configuration.domainOfInfluence.id,
          sampleCount: configuration.sampleCount,
          votingCardGroups: configuration.votingCardGroups,
          votingCardSorts: configuration.votingCardSorts,
        }),
      ),
    );
  }

  public getPdfPreview(domainOfInfluenceId: string, votingCardType: VotingCardType): Promise<Uint8Array> {
    return firstValueFrom(
      this.client.getPdfPreview(new GetDomainOfInfluenceVotingCardPdfPreviewRequest({ domainOfInfluenceId, votingCardType })),
    ).then(x => x.pdf!);
  }
}
