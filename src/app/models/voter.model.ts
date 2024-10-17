/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Country as CountryProto,
  Salutation,
  ManualVotingCardVoter as ManualVotingCardVoterProto,
  VotingCardType,
  VoterDuplicate as VoterDuplicateProto,
} from '@abraxas/voting-stimmunterlagen-proto';

export { ManualVotingCardVoterProto, CountryProto };
export interface VoterDuplicate extends Required<VoterDuplicateProto.AsObject> {}

export interface ManualVotingCardVoter
  extends Omit<Required<ManualVotingCardVoterProto.AsObject>, 'swissZipCode' | 'foreignZipCode' | 'country' | 'dateOfBirth'> {
  country: Required<CountryProto.AsObject>;
  swissZipCode?: number;
  foreignZipCode?: string;
  dateOfBirth?: Date;
}

export function newManualVotingCardVoter(): ManualVotingCardVoter {
  return {
    salutation: Salutation.UNSPECIFIED,
    country: {
      name: 'Schweiz',
      iso2: 'CH',
    },
    addressLine1: '',
    addressLine2: '',
    dwellingNumber: '',
    firstName: '',
    houseNumber: '',
    languageOfCorrespondence: 'de',
    lastName: '',
    locality: '',
    street: '',
    title: '',
    town: '',
    votingCardType: VotingCardType.VOTING_CARD_TYPE_SWISS,
    personId: '',
  };
}
