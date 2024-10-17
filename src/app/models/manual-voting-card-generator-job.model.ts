/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ManualVotingCardGeneratorJob as ManualVotingCardGeneratorJobProto } from '@abraxas/voting-stimmunterlagen-proto';
import { User } from './user.model';
import { ManualVotingCardVoter } from './voter.model';

export { ManualVotingCardGeneratorJobProto };

export interface ManualVotingCardGeneratorJob {
  id: string;
  created: Date;
  createdBy: User;
  voter: ManualVotingCardVoter;
}
