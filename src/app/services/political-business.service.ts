/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ListPoliticalBusinessesRequest, PoliticalBusinessServiceClient } from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { mapPoliticalBusiness, PoliticalBusiness } from '../models/political-business.model';
import { groupBy } from './utils/array.utils';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoliticalBusinessService {
  constructor(private readonly client: PoliticalBusinessServiceClient) {}

  public listForContest(contestId?: string): Promise<PoliticalBusiness[]> {
    contestId ??= '';
    return firstValueFrom(this.client.list(new ListPoliticalBusinessesRequest({ contestId }))).then(x =>
      (x.politicalBusinesses ?? []).map(x => mapPoliticalBusiness(x)),
    );
  }

  public listForDomainOfInfluence(domainOfInfluenceId: string): Promise<PoliticalBusiness[]> {
    return firstValueFrom(this.client.list(new ListPoliticalBusinessesRequest({ domainOfInfluenceId }))).then(x =>
      (x.politicalBusinesses ?? []).map(x => mapPoliticalBusiness(x)),
    );
  }

  public listGroupedByManager(contestId?: string): Promise<Record<string, PoliticalBusiness[]>> {
    return this.listForContest(contestId).then(x => groupBy(x, x => x.domainOfInfluence.authorityName));
  }
}
