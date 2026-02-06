/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { PoliticalBusiness as PoliticalBusinessProto } from '@abraxas/voting-stimmunterlagen-proto';
import { DomainOfInfluence } from './domain-of-influence.model';

export interface PoliticalBusiness extends Omit<Required<PoliticalBusinessProto.AsObject>, 'domainOfInfluence' | 'eVotingApproved'> {
  domainOfInfluence: DomainOfInfluence;
  eVotingApproved?: boolean;
}

export function mapPoliticalBusiness(politicalBusinessProto: PoliticalBusinessProto): PoliticalBusiness {
  return {
    ...politicalBusinessProto.toObject(),
    eVotingApproved: politicalBusinessProto.eVotingApproved?.toObject().value,
  } as PoliticalBusiness;
}
