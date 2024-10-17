/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  PrintJobState,
  PrintJob as PrintJobProto,
  PrintJobs as PrintJobsProto,
  PrintJobSummary as PrintJobSummaryProto,
  PrintJobSummaries as PrintJobSummariesProto,
  Step,
} from '@abraxas/voting-stimmunterlagen-proto';
import { DomainOfInfluence } from './domain-of-influence.model';

export { PrintJobState };

export interface PrintJobSummary extends PrintJob {
  attachmentsDefinedCount: number;
  attachmentsDeliveredCount: number;
  hasCommunalPoliticalBusinesses: boolean;
  templateName: string;
  lastConfirmedStep: Step;
}

export interface PrintJob {
  domainOfInfluence: DomainOfInfluence;
  state: PrintJobState;
  processStartedOn?: Date;
  processEndedOn?: Date;
  doneOn?: Date;
  generateVotingCardsTriggered?: Date;
}

export function mapPrintJob(printJobProto: PrintJobProto): PrintJob {
  return {
    ...(<Required<PrintJobProto.AsObject>>printJobProto.toObject()),
    domainOfInfluence: printJobProto.domainOfInfluence?.toObject() as DomainOfInfluence,
    processStartedOn: printJobProto.processStartedOn?.toDate(),
    processEndedOn: printJobProto.processEndedOn?.toDate(),
    doneOn: printJobProto.doneOn?.toDate(),
    generateVotingCardsTriggered: printJobProto.generateVotingCardsTriggered?.toDate(),
  };
}

export function mapPrintJobSummary(printJobProto: PrintJobSummaryProto): PrintJobSummary {
  return {
    ...(<Required<PrintJobSummaryProto.AsObject>>printJobProto.toObject()),
    domainOfInfluence: printJobProto.domainOfInfluence?.toObject() as DomainOfInfluence,
    processStartedOn: printJobProto.processStartedOn?.toDate(),
    processEndedOn: printJobProto.processEndedOn?.toDate(),
    doneOn: printJobProto.doneOn?.toDate(),
    generateVotingCardsTriggered: printJobProto.generateVotingCardsTriggered?.toDate(),
  };
}

export function mapPrintJobs(printJobsProto: PrintJobsProto): PrintJob[] {
  return (printJobsProto.printJobs ?? []).map(x => mapPrintJob(x));
}

export function mapPrintJobSummaries(printJobSummariesProto: PrintJobSummariesProto): PrintJobSummary[] {
  return (printJobSummariesProto.summaries ?? []).map(x => mapPrintJobSummary(x));
}
