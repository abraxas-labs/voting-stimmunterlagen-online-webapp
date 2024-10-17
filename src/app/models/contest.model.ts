/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Contest as ContestProto, Contests as ContestsProto, ContestState } from '@abraxas/voting-stimmunterlagen-proto';
import { toApiDate, toUTCDate } from '../services/utils/date.utils';
import { DomainOfInfluence } from './domain-of-influence.model';

export { ContestState };

export interface Contest
  extends Omit<
    Required<ContestProto.AsObject>,
    | 'date'
    | 'domainOfInfluence'
    | 'attachmentDeliveryDeadline'
    | 'printingCenterSignUpDeadline'
    | 'generateVotingCardsDeadline'
    | 'approved'
  > {
  date: Date;
  approved?: Date;
  domainOfInfluence: DomainOfInfluence;
  attachmentDeliveryDeadlineDate?: Date;
  printingCenterSignUpDeadlineDate?: Date;
  generateVotingCardsDeadlineDate?: Date;
  locked: boolean;
  isPastPrintingCenterSignUpDeadline?: boolean;
  isPastGenerateVotingCardsDeadline?: boolean;
}

export function mapContest(contestProto: ContestProto): Contest {
  const attachmentDeliveryDeadline = contestProto.attachmentDeliveryDeadline?.toDate();
  const printingCenterSignUpDeadline = contestProto.printingCenterSignUpDeadline?.toDate();
  const generateVotingCardsDeadline = contestProto.generateVotingCardsDeadline?.toDate();

  let contest: Contest = {
    ...(<Required<ContestProto.AsObject>>contestProto.toObject()),
    date: contestProto.date!.toDate(),
    approved: contestProto.approved?.toDate(),
    domainOfInfluence: contestProto.domainOfInfluence?.toObject() as DomainOfInfluence,
    locked: contestProto.state === ContestState.CONTEST_STATE_PAST_LOCKED || contestProto.state === ContestState.CONTEST_STATE_ARCHIVED,
  };

  if (!!printingCenterSignUpDeadline && !!attachmentDeliveryDeadline) {
    const attachmentDeliveryDeadlineDate = new Date(attachmentDeliveryDeadline);
    const printingCenterSignUpDeadlineDate = new Date(printingCenterSignUpDeadline);
    toUTCDate(attachmentDeliveryDeadlineDate);
    toUTCDate(printingCenterSignUpDeadlineDate);
    contest.attachmentDeliveryDeadlineDate = attachmentDeliveryDeadlineDate;
    contest.printingCenterSignUpDeadlineDate = printingCenterSignUpDeadlineDate;
  }

  if (!!generateVotingCardsDeadline) {
    const generateVotingCardsDeadlinDate = new Date(generateVotingCardsDeadline);
    toUTCDate(generateVotingCardsDeadlinDate);
    contest.generateVotingCardsDeadlineDate = generateVotingCardsDeadlinDate;
  }

  refreshContestDeadlineStates(contest);
  return contest;
}

export function mapContests(contestsProto: ContestsProto): Contest[] {
  return (contestsProto.contests ?? []).map(c => mapContest(c));
}

export function refreshContestDeadlineStates(contest: Contest): void {
  const now = new Date();

  if (!!contest.printingCenterSignUpDeadlineDate) {
    const printingCenterSignUpDeadline = new Date(contest.printingCenterSignUpDeadlineDate);
    toApiDate(printingCenterSignUpDeadline);
    contest.isPastPrintingCenterSignUpDeadline = printingCenterSignUpDeadline < now;
  }

  if (!!contest.generateVotingCardsDeadlineDate) {
    const generateVotingCardsDeadline = new Date(contest.generateVotingCardsDeadlineDate);
    toApiDate(generateVotingCardsDeadline);
    contest.isPastGenerateVotingCardsDeadline = generateVotingCardsDeadline < now;
  }
}
