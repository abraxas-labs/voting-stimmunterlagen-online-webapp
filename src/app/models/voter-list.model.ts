/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VoterList as VoterListProto, VoterLists as VoterListsProto } from '@abraxas/voting-stimmunterlagen-proto';
import { CheckableItems } from './checkable-item.model';
import { DomainOfInfluence } from './domain-of-influence.model';
import { PoliticalBusiness } from './political-business.model';
import { VoterDuplicate } from './voter.model';

export interface VoterList
  extends Omit<Required<VoterListProto.AsObject>, 'lastUpdate' | 'sendVotingCardsToDomainOfInfluenceReturnAddress' | 'voterDuplicates'> {
  lastUpdate: Date;
  checkablePoliticalBusinesses: CheckableItems<PoliticalBusiness>;
  sendVotingCardsToDomainOfInfluenceReturnAddress?: boolean;
  hasVoterDuplicates: boolean;
  voterDuplicates: VoterDuplicate[];
}

export interface VoterLists {
  voterLists: VoterList[];
  numberOfVoters: PoliticalBusinessNumberOfVoters[];
  totalNumberOfVoters: number;
}

export interface DomainOfInfluenceVoterLists extends VoterLists {
  domainOfInfluence: DomainOfInfluence;
}

export interface PoliticalBusinessNumberOfVoters {
  politicalBusiness: PoliticalBusiness;
  numberOfVoters: number;
}

export function newVoterList(checkablePoliticalBusinesses: CheckableItems<PoliticalBusiness>): VoterList {
  return {
    checkablePoliticalBusinesses,
  } as VoterList;
}

export function mapVoterList(voterListProto: VoterListProto): VoterList {
  return {
    ...(<Required<VoterListProto.AsObject>>voterListProto.toObject()),
    lastUpdate: voterListProto.lastUpdate!.toDate(),
    voterDuplicates: voterListProto.voterDuplicates!.map(d => <Required<VoterDuplicate>>d.toObject()),
    hasVoterDuplicates: voterListProto.voterDuplicates!.length > 0,
    // will be assigned in business
    checkablePoliticalBusinesses: {} as CheckableItems<PoliticalBusiness>,
    sendVotingCardsToDomainOfInfluenceReturnAddress: voterListProto.sendVotingCardsToDomainOfInfluenceReturnAddress?.value,
  };
}

export function mapVoterLists(voterListsProto: VoterListsProto): VoterLists {
  return {
    ...(<Required<VoterListsProto.AsObject>>voterListsProto.toObject()),
    voterLists: voterListsProto.voterLists!.map(vl => mapVoterList(vl)),
    numberOfVoters: voterListsProto.toObject().numberOfVoters as PoliticalBusinessNumberOfVoters[],
  };
}
