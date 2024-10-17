/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Step, StepState as StepStateProto } from '@abraxas/voting-stimmunterlagen-proto';
import { Contest } from './contest.model';
import { DomainOfInfluence } from './domain-of-influence.model';

export { Step };

export type StepProgressState = 'complete' | 'progress' | 'open' | 'error';

export interface StepState extends Required<StepStateProto.AsObject> {
  progressState: StepProgressState;
  disabled: boolean;
  canApprove: boolean;
  canRevert: boolean;
}

export interface StepInfo {
  contest: Contest;
  domainOfInfluence: DomainOfInfluence;
  steps: StepState[];
  state: StepState;
}
