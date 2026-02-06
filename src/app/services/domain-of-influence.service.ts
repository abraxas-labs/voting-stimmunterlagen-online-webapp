/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  DomainOfInfluenceServiceClient,
  IdValueRequest,
  ListDomainOfInfluenceChildrenRequest,
  ListDomainOfInfluencesRequest,
  ListEVotingDomainOfInfluencesRequest,
  SetCountOfEmptyVotingCardsDomainOfInfluenceRequest,
  UpdateDomainOfInfluenceSettingsRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { DomainOfInfluence, mapDomainOfInfluence } from '../models/domain-of-influence.model';
import { EVotingDomainOfInfluenceEntry } from '../models/e-voting-domain-of-influence.model';
import { firstValueFrom, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceService {
  private readonly client = inject(DomainOfInfluenceServiceClient);

  private _domainOfInfluenceWithIdSettingsUpdated: Subject<string> = new Subject<string>();

  public get domainOfInfluenceWithIdSettingsUpdated(): Observable<string> {
    return this._domainOfInfluenceWithIdSettingsUpdated;
  }

  public get(id: string): Promise<DomainOfInfluence> {
    return firstValueFrom(this.client.get(new IdValueRequest({ id }))).then(x => mapDomainOfInfluence(x));
  }

  public listManagedByCurrentTenant(contestId: string): Promise<DomainOfInfluence[]> {
    return firstValueFrom(this.client.listManagedByCurrentTenant(new ListDomainOfInfluencesRequest({ contestId }))).then(x =>
      x.domainOfInfluences!.map(doi => mapDomainOfInfluence(doi)),
    );
  }

  public listEVoting(contestId: string): Promise<EVotingDomainOfInfluenceEntry[]> {
    return firstValueFrom(this.client.listEVoting(new ListEVotingDomainOfInfluencesRequest({ contestId }))).then(
      x => x.toObject().entries as EVotingDomainOfInfluenceEntry[],
    );
  }

  public listChildren(domainOfInfluenceId: string): Promise<DomainOfInfluence[]> {
    return firstValueFrom(this.client.listChildren(new ListDomainOfInfluenceChildrenRequest({ domainOfInfluenceId }))).then(
      x => x.toObject().domainOfInfluences as DomainOfInfluence[],
    );
  }

  public async updateSettings(domainOfInfluenceId: string, allowManualVoterListUpload: boolean): Promise<void> {
    await firstValueFrom(
      this.client.updateSettings(new UpdateDomainOfInfluenceSettingsRequest({ domainOfInfluenceId, allowManualVoterListUpload })),
    );

    this._domainOfInfluenceWithIdSettingsUpdated.next(domainOfInfluenceId);
  }

  public async setCountOfEmptyVotingCards(domainOfInfluenceId: string, countOfEmptyVotingCards: number): Promise<void> {
    await firstValueFrom(
      this.client.setCountOfEmptyVotingCards(
        new SetCountOfEmptyVotingCardsDomainOfInfluenceRequest({ domainOfInfluenceId, countOfEmptyVotingCards }),
      ),
    );
  }
}
