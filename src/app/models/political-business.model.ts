/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { PoliticalBusiness as PoliticalBusinessProto } from '@abraxas/voting-stimmunterlagen-proto';
import { DomainOfInfluence } from './domain-of-influence.model';

export interface PoliticalBusiness extends Omit<Required<PoliticalBusinessProto.AsObject>, 'domainOfInfluence'> {
  domainOfInfluence: DomainOfInfluence;
}

export function mapPoliticalBusiness(politicalBusinessProto: PoliticalBusinessProto): PoliticalBusiness {
  return politicalBusinessProto.toObject() as PoliticalBusiness;
}
