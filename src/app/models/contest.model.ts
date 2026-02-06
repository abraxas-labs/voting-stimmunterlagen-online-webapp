/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Contest as ContestProto, Contests as ContestsProto, ContestState } from '@abraxas/voting-stimmunterlagen-proto';
import { addDays, newUTCDate, toApiDate } from '../services/utils/date.utils';
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
    | 'electoralRegisterEVotingFrom'
    | 'deliveryToPostDeadline'
    | 'approved'
  > {
  date: Date;
  approved?: Date;
  domainOfInfluence: DomainOfInfluence;
  attachmentDeliveryDeadlineDate?: Date;
  printingCenterSignUpDeadlineDate?: Date;
  generateVotingCardsDeadlineDate?: Date;
  electoralRegisterEVotingFromDate?: Date;
  deliveryToPostDeadlineDate?: Date;
  locked: boolean;
  isPastPrintingCenterSignUpDeadline?: boolean;
  isPastGenerateVotingCardsDeadline?: boolean;
  electoralRegisterEVotingActive?: boolean;
}

export interface CommunalContestDeadlinesCalculationResult {
  attachmentDeliveryDeadlineDate?: Date;
  printingCenterSignUpDeadlineDate?: Date;
  generateVotingCardsDeadlineDate?: Date;
  deliveryToPostDeadlineDate?: Date;
}

export function mapContest(contestProto: ContestProto): Contest {
  const attachmentDeliveryDeadline = contestProto.attachmentDeliveryDeadline?.toDate();
  const printingCenterSignUpDeadline = contestProto.printingCenterSignUpDeadline?.toDate();
  const generateVotingCardsDeadline = contestProto.generateVotingCardsDeadline?.toDate();
  const electoralRegisterEVotingFrom = contestProto.electoralRegisterEVotingFrom?.toDate();
  const deliveryToPostDeadline = contestProto.deliveryToPostDeadline?.toDate();

  let contest: Contest = {
    ...(<Required<ContestProto.AsObject>>contestProto.toObject()),
    date: contestProto.date!.toDate(),
    approved: contestProto.approved?.toDate(),
    domainOfInfluence: contestProto.domainOfInfluence?.toObject() as DomainOfInfluence,
    locked: contestProto.state === ContestState.CONTEST_STATE_PAST_LOCKED || contestProto.state === ContestState.CONTEST_STATE_ARCHIVED,
  };

  contest.attachmentDeliveryDeadlineDate = newUTCDate(attachmentDeliveryDeadline);
  contest.printingCenterSignUpDeadlineDate = newUTCDate(printingCenterSignUpDeadline);
  contest.generateVotingCardsDeadlineDate = newUTCDate(generateVotingCardsDeadline);
  contest.deliveryToPostDeadlineDate = newUTCDate(deliveryToPostDeadline);

  // Adding 1 day is necessary for the UI, because the e-voting from excludes the current day, while deadlines include it.
  // Ex: 26.03 from = 25.03 22:00Z, 26.03 deadline = 26.03 22:00Z.
  contest.electoralRegisterEVotingFromDate = newUTCDate(electoralRegisterEVotingFrom);
  if (contest.electoralRegisterEVotingFromDate) {
    addDays(contest.electoralRegisterEVotingFromDate, 1);
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

  if (!!contest.electoralRegisterEVotingFromDate) {
    const electoralRegisterEVotingFrom = new Date(contest.electoralRegisterEVotingFromDate);
    toApiDate(electoralRegisterEVotingFrom);

    // Subtracting 1 day is necessary for the API, because the e-voting from excludes the current day, while deadlines include it.
    // Ex: 26.03 from = 25.03 22:00Z, 26.03 deadline = 26.03 22:00Z.
    addDays(electoralRegisterEVotingFrom, -1);
    contest.electoralRegisterEVotingActive = electoralRegisterEVotingFrom < now;
  }
}
