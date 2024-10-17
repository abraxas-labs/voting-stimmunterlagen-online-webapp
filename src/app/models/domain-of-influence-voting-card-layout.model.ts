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

export { DomainOfInfluenceVotingCardLayoutProto };

export interface DomainOfInfluenceVotingCardLayout {
  contestTemplate: Template;
  domainOfInfluenceTemplate?: Template;
  overriddenTemplate?: Template;
  effectiveTemplate: Template;
  allowCustom: boolean;
  votingCardType: VotingCardType;
  domainOfInfluence: DomainOfInfluence;
}

export interface DomainOfInfluenceVotingCardLayouts {
  domainOfInfluence: DomainOfInfluence;
  layouts: Record<VotingCardType, DomainOfInfluenceVotingCardLayout>;
}
