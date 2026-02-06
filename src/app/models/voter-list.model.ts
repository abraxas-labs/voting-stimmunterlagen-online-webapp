/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  VoterList as VoterListProto,
  VoterListSource,
  VoterLists as VoterListsProto,
  VotingCardType,
} from '@abraxas/voting-stimmunterlagen-proto';
import { CheckableItems } from './checkable-item.model';
import { DomainOfInfluence } from './domain-of-influence.model';
import { PoliticalBusiness } from './political-business.model';

export interface VoterList
  extends Omit<Required<VoterListProto.AsObject>, 'lastUpdate' | 'sendVotingCardsToDomainOfInfluenceReturnAddress' | 'voterDuplicates'> {
  lastUpdate: Date;
  checkablePoliticalBusinesses: CheckableItems<PoliticalBusiness>;
  sendVotingCardsToDomainOfInfluenceReturnAddress?: boolean;
}

export interface VoterLists {
  voterLists: VoterList[];
  countOfVotingCards: PoliticalBusinessCountOfVotingCards[];
  totalNumberOfVoters: number;
  totalCountOfVotingCards: number;
}

export interface DomainOfInfluenceVoterLists extends VoterLists {
  domainOfInfluence: DomainOfInfluence;
}

export interface PoliticalBusinessCountOfVotingCards {
  politicalBusiness: PoliticalBusiness;
  countOfVotingCards: number;
}

export function newVoterListWithEmptyVotingCards(
  domainOfInfluence: DomainOfInfluence,
  name: string,
  politicalBusinessIds: string[],
): VoterList {
  return {
    id: '',
    name,
    numberOfVoters: domainOfInfluence.countOfEmptyVotingCards,
    countOfVotingCardsForDomainOfInfluenceReturnAddress: domainOfInfluence.countOfEmptyVotingCards,
    countOfVotingCards: domainOfInfluence.countOfEmptyVotingCards,
    votingCardType: VotingCardType.VOTING_CARD_TYPE_SWISS,
    // will be assigned in business
    checkablePoliticalBusinesses: {} as CheckableItems<PoliticalBusiness>,
    importId: '',
    lastUpdate: domainOfInfluence.lastCountOfEmptyVotingCardsUpdate!,
    politicalBusinessIds,
    source: VoterListSource.VOTER_LIST_SOURCE_UNSPECIFIED,
  };
}

export function mapVoterList(voterListProto: VoterListProto): VoterList {
  return {
    ...(<Required<VoterListProto.AsObject>>voterListProto.toObject()),
    lastUpdate: voterListProto.lastUpdate!.toDate(),
    // will be assigned in business
    checkablePoliticalBusinesses: {} as CheckableItems<PoliticalBusiness>,
    sendVotingCardsToDomainOfInfluenceReturnAddress: voterListProto.sendVotingCardsToDomainOfInfluenceReturnAddress?.value,
  };
}

export function mapVoterLists(voterListsProto: VoterListsProto): VoterLists {
  return {
    ...(<Required<VoterListsProto.AsObject>>voterListsProto.toObject()),
    voterLists: voterListsProto.voterLists!.map(vl => mapVoterList(vl)),
    countOfVotingCards: voterListsProto.toObject().countOfVotingCards as PoliticalBusinessCountOfVotingCards[],
  };
}
