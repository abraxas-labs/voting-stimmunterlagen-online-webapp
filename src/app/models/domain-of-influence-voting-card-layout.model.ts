/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  DomainOfInfluenceVotingCardLayout as DomainOfInfluenceVotingCardLayoutProto,
  VotingCardType,
} from '@abraxas/voting-stimmunterlagen-proto';
import { DomainOfInfluence } from './domain-of-influence.model';
import { Template } from './template.model';
import { VotingCardLayoutDataConfiguration } from './voting-card-layout.model';

export { DomainOfInfluenceVotingCardLayoutProto };

export interface DomainOfInfluenceVotingCardLayout {
  contestTemplate: Template;
  domainOfInfluenceTemplate?: Template;
  overriddenTemplate?: Template;
  effectiveTemplate: Template;
  allowCustom: boolean;
  votingCardType: VotingCardType;
  domainOfInfluence: DomainOfInfluence;
  dataConfiguration: VotingCardLayoutDataConfiguration;
}

export interface DomainOfInfluenceVotingCardLayouts {
  domainOfInfluence: DomainOfInfluence;
  layouts: Record<VotingCardType, DomainOfInfluenceVotingCardLayout>;
}

export function equalsVotingCardLayoutDataConfiguration(
  a: VotingCardLayoutDataConfiguration,
  b: VotingCardLayoutDataConfiguration,
): boolean {
  return (
    a.includeDateOfBirth === b.includeDateOfBirth &&
    a.includeIsHouseholder === b.includeIsHouseholder &&
    a.includePersonId === b.includePersonId &&
    a.includeReligion === b.includeReligion &&
    a.includeDomainOfInfluenceChurch === b.includeDomainOfInfluenceChurch &&
    a.includeDomainOfInfluenceSchool === b.includeDomainOfInfluenceSchool
  );
}
