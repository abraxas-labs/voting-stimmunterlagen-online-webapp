/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { DomainOfInfluence } from '../../models/domain-of-influence.model';
import { PoliticalBusiness } from '../../models/political-business.model';
import { StepInfo } from '../../models/step.model';
import {
  DomainOfInfluenceVoterLists,
  newVoterListWithEmptyVotingCards,
  PoliticalBusinessCountOfVotingCards,
  VoterList,
  VoterLists,
} from '../../models/voter-list.model';
import { PoliticalBusinessService } from '../political-business.service';
import { VoterListService } from '../voter-list.service';
import { addCheckablePoliticalBusinessesToVoterLists } from '../utils/voter-list.utils';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceVoterListsBuilder {
  private readonly voterListService = inject(VoterListService);
  private readonly politicalBusinessService = inject(PoliticalBusinessService);
  private readonly i18n = inject(TranslateService);

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
    if (domainOfInfluence.countOfEmptyVotingCards > 0) {
      voterLists.voterLists = [
        ...voterLists.voterLists,
        newVoterListWithEmptyVotingCards(
          domainOfInfluence,
          this.i18n.instant('VOTER_LIST.EMPTY_VOTING_CARDS.VOTER_LIST_NAME'),
          voterLists.countOfVotingCards.map(c => c.politicalBusiness.id),
        ),
      ];
    }

    this.addMissingPoliticalBusinessCountOfVotingCards(voterLists, pbs);
    addCheckablePoliticalBusinessesToVoterLists(voterLists.voterLists, pbs);

    return {
      ...voterLists,
      domainOfInfluence,
    };
  }

  private addMissingPoliticalBusinessCountOfVotingCards(voterLists: VoterLists, pbs: PoliticalBusiness[]): void {
    const pbIds = pbs.map(pb => pb.id);
    const missingEntries: PoliticalBusinessCountOfVotingCards[] = pbs
      .filter(pb => !voterLists.countOfVotingCards.find(n => n.politicalBusiness.id === pb.id))
      .map(pb => ({
        politicalBusiness: pb,
        countOfVotingCards: 0,
      }));

    voterLists.countOfVotingCards = [...voterLists.countOfVotingCards, ...missingEntries];
    voterLists.countOfVotingCards.sort((a, b) => pbIds.indexOf(a.politicalBusiness.id) - pbIds.indexOf(b.politicalBusiness.id));
  }
}
