/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DomainOfInfluenceVotingCardConfiguration as DomainOfInfluenceVotingCardConfigurationProto } from '@abraxas/voting-stimmunterlagen-proto';
import { DomainOfInfluence } from './domain-of-influence.model';

export interface DomainOfInfluenceVotingCardConfiguration
  extends Required<Omit<DomainOfInfluenceVotingCardConfigurationProto.AsObject, 'domainOfInfluence'>> {
  domainOfInfluence: DomainOfInfluence;
}
