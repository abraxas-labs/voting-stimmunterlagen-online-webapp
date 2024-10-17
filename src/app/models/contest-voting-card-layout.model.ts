/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ContestVotingCardLayout as ContestVotingCardLayoutProto } from '@abraxas/voting-stimmunterlagen-proto';
import { Template } from './template.model';

export interface ContestVotingCardLayout extends Required<Omit<ContestVotingCardLayoutProto.AsObject, 'template'>> {
  template?: Template;
}
