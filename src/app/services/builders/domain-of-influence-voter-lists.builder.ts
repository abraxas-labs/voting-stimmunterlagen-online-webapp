/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { DomainOfInfluence } from '../../models/domain-of-influence.model';
import { PoliticalBusiness } from '../../models/political-business.model';
import { StepInfo } from '../../models/step.model';
import { DomainOfInfluenceVoterLists, PoliticalBusinessNumberOfVoters, VoterList, VoterLists } from '../../models/voter-list.model';
import { PoliticalBusinessService } from '../political-business.service';
import { VoterListService } from '../voter-list.service';
import { addCheckablePoliticalBusinessesToVoterLists } from '../utils/voter-list.utils';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceVoterListsBuilder {
  constructor(
    private readonly voterListService: VoterListService,
    private readonly politicalBusinessService: PoliticalBusinessService,
  ) {}

  public async build(stepInfo: StepInfo): Promise<DomainOfInfluenceVoterLists> {
    const politicalBusinesses = await this.politicalBusinessService.listForDomainOfInfluence(stepInfo.domainOfInfluence.id);
    const voterLists = await this.voterListService.list(stepInfo.domainOfInfluence.id);
    return this.buildVoterLists(voterLists, politicalBusinesses, stepInfo.domainOfInfluence);
  }

  private buildVoterLists(
    voterLists: VoterLists,
    pbs: PoliticalBusiness[],
    domainOfInfluence: DomainOfInfluence,
  ): DomainOfInfluenceVoterLists {
    this.addMissingPoliticalBusinessNumberOfVoters(voterLists, pbs);
    addCheckablePoliticalBusinessesToVoterLists(voterLists.voterLists, pbs);

    return {
      ...voterLists,
      domainOfInfluence,
    };
  }

  private addMissingPoliticalBusinessNumberOfVoters(voterLists: VoterLists, pbs: PoliticalBusiness[]): void {
    const pbIds = pbs.map(pb => pb.id);
    const missingEntries: PoliticalBusinessNumberOfVoters[] = pbs
      .filter(pb => !voterLists.numberOfVoters.find(n => n.politicalBusiness.id === pb.id))
      .map(pb => ({
        politicalBusiness: pb,
        numberOfVoters: 0,
      }));

    voterLists.numberOfVoters = [...voterLists.numberOfVoters, ...missingEntries];
    voterLists.numberOfVoters.sort((a, b) => pbIds.indexOf(a.politicalBusiness.id) - pbIds.indexOf(b.politicalBusiness.id));
  }
}
