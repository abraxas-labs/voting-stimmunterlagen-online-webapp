/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  VotingCardGeneratorJob as VotingCardGeneratorJobProto,
  VotingCardGeneratorJobState,
  VotingCardType,
} from '@abraxas/voting-stimmunterlagen-proto';

export { VotingCardGeneratorJobState, VotingCardGeneratorJobProto };

export interface VotingCardGeneratorJob {
  id: string;
  fileName: string;
  countOfVoters: number;
  votingCardType: VotingCardType;
  state: VotingCardGeneratorJobState;
}
