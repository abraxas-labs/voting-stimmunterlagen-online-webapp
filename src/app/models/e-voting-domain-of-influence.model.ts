/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DomainOfInfluence } from './domain-of-influence.model';

export interface EVotingDomainOfInfluenceEntry {
  eVotingReady: boolean;
  parentPoliticalBusinessesCount: number;
  ownPoliticalBusinessesCount: number;
  numberOfEVoters: number;
  domainOfInfluence: DomainOfInfluence;
}
