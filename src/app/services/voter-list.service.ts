/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AssignPoliticalBusinessVoterListRequest,
  ListVoterListsRequest,
  UnassignPoliticalBusinessVoterListRequest,
  UpdateVoterListRequest,
  UpdateVoterListsRequest,
  VoterListServiceClient,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { mapVoterLists, VoterList, VoterLists } from '../models/voter-list.model';
import { firstValueFrom } from 'rxjs';
import { BoolValue } from '@ngx-grpc/well-known-types';

@Injectable({
  providedIn: 'root',
})
export class VoterListService {
  private readonly client = inject(VoterListServiceClient);

  private readonly restApiUrl: string = '';

  public list(domainOfInfluenceId: string): Promise<VoterLists> {
    return firstValueFrom(this.client.list(new ListVoterListsRequest({ domainOfInfluenceId }))).then(x => mapVoterLists(x));
  }

  public assignPoliticalBusiness(id: string, politicalBusinessId: string) {
    return firstValueFrom(
      this.client.assignPoliticalBusiness(
        new AssignPoliticalBusinessVoterListRequest({
          id,
          politicalBusinessId,
        }),
      ),
    );
  }

  public unassignPoliticalBusiness(id: string, politicalBusinessId: string) {
    return firstValueFrom(
      this.client.unassignPoliticalBusiness(
        new UnassignPoliticalBusinessVoterListRequest({
          id,
          politicalBusinessId,
        }),
      ),
    );
  }

  public updateLists(voterLists: VoterList[]) {
    return firstValueFrom(
      this.client.updateLists(
        new UpdateVoterListsRequest({
          voterLists: voterLists.map(this.mapToUpdateVoterListRequest),
        }),
      ),
    );
  }

  private mapToUpdateVoterListRequest(voterList: VoterList): UpdateVoterListRequest {
    const req = new UpdateVoterListRequest();

    if (voterList.sendVotingCardsToDomainOfInfluenceReturnAddress !== undefined) {
      req.sendVotingCardsToDomainOfInfluenceReturnAddress = new BoolValue();
      req.sendVotingCardsToDomainOfInfluenceReturnAddress.value = voterList.sendVotingCardsToDomainOfInfluenceReturnAddress;
    }

    req.id = voterList.id;
    req.politicalBusinessIds = voterList.checkablePoliticalBusinesses.items.filter(x => x.checked).map(x => x.item.id);
    return req;
  }
}
