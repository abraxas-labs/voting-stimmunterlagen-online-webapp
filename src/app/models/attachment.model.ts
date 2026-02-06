/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  Attachment as AttachmentProto,
  AttachmentFormat,
  Attachments as AttachmentsProto,
  AttachmentState,
  AttachmentCategory,
  AttachmentCategorySummary as AttachmentCategorySummaryProto,
  AttachmentCategorySummaries as AttachmentCategorySummariesProto,
  DomainOfInfluenceAttachmentCategorySummariesEntries as DomainOfInfluenceAttachmentCategorySummariesEntriesProto,
  DomainOfInfluenceAttachmentCategorySummariesEntry as DomainOfInfluenceAttachmentCategorySummariesEntryProto,
  DomainOfInfluenceAttachmentCount as DomainOfInfluenceAttachmentCountProto,
} from '@abraxas/voting-stimmunterlagen-proto';
import { CheckableItems } from './checkable-item.model';
import { DomainOfInfluence } from './domain-of-influence.model';
import { mapPoliticalBusiness, PoliticalBusiness } from './political-business.model';

export { AttachmentFormat, AttachmentState, AttachmentCategory };

export interface Attachment
  extends Omit<
    Required<AttachmentProto.AsObject>,
    | 'domainOfInfluence'
    | 'deliveryPlannedOn'
    | 'deliveryReceivedOn'
    | 'domainOfInfluenceAttachmentRequiredCount'
    | 'domainOfInfluenceAttachmentRequiredForVoterListsCount'
    | 'station'
  > {
  domainOfInfluence: DomainOfInfluence;
  deliveryPlannedOn?: Date;
  deliveryReceivedOn?: Date;
  checkablePoliticalBusinesses: CheckableItems<PoliticalBusiness>;
  domainOfInfluenceAttachmentRequiredCount?: number;
  domainOfInfluenceAttachmentRequiredForVoterListsCount?: number;
  station?: number;
  totalRequiredCount: number;
  totalRequiredForVoterListsCount: number;
}

export interface AttachmentCategorySummary {
  category: AttachmentCategory;
  attachments: Attachment[];
  totalOrderedCount: number;
  totalRequiredCount: number;
  totalRequiredForVoterListsCount: number;
}

export interface DomainOfInfluenceAttachmentCategorySummariesEntry {
  domainOfInfluence: DomainOfInfluence;
  attachmentCategorySummaries: AttachmentCategorySummary[];
  politicalBusinesses: PoliticalBusiness[];
}

export interface DomainOfInfluenceAttachmentCount {
  attachmentId: string;
  domainOfInfluence: DomainOfInfluence;
  requiredCount?: number;
  requiredForVoterListsCount: number;
}

export interface AttachmentsProgress {
  stationsSet: boolean;
}

export type AttachmentTableEntry = Attachment | AttachmentCategorySummary;

export function newAttachment(
  domainOfInfluence: DomainOfInfluence,
  checkablePoliticalBusinesses: CheckableItems<PoliticalBusiness>,
): Attachment {
  return {
    domainOfInfluence,
    checkablePoliticalBusinesses,
    format: AttachmentFormat.ATTACHMENT_FORMAT_A5,
  } as Attachment;
}

export function newAttachmentCategorySummary(category: AttachmentCategory): AttachmentCategorySummary {
  return {
    category,
    attachments: [],
    totalOrderedCount: 0,
    totalRequiredCount: 0,
    totalRequiredForVoterListsCount: 0,
  };
}

export function mapAttachment(attachmentProto: AttachmentProto): Attachment {
  return {
    ...(<Required<AttachmentProto.AsObject>>attachmentProto.toObject()),
    domainOfInfluenceAttachmentRequiredCount: attachmentProto.domainOfInfluenceAttachmentRequiredCount?.value,
    domainOfInfluenceAttachmentRequiredForVoterListsCount: attachmentProto.domainOfInfluenceAttachmentRequiredForVoterListsCount?.value,
    station: attachmentProto.station?.value,
    deliveryPlannedOn: attachmentProto.deliveryPlannedOn?.toDate(),
    deliveryReceivedOn: attachmentProto.deliveryReceivedOn?.toDate(),
    domainOfInfluence: attachmentProto.domainOfInfluence?.toObject() as DomainOfInfluence,
    // will be assigned per doi attachments builder
    checkablePoliticalBusinesses: {} as CheckableItems<PoliticalBusiness>,
  };
}

export function mapAttachmentCategorySummary(proto: AttachmentCategorySummaryProto): AttachmentCategorySummary {
  return {
    ...(<Required<AttachmentCategorySummaryProto.AsObject>>proto.toObject()),
    attachments: proto.attachments!.map(a => mapAttachment(a)),
  };
}

export function mapAttachmentCategorySummaries(proto: AttachmentCategorySummariesProto): AttachmentCategorySummary[] {
  return (proto.summaries ?? []).map(s => mapAttachmentCategorySummary(s));
}

export function mapDomainOfInfluenceAttachmentCount(proto: DomainOfInfluenceAttachmentCountProto): DomainOfInfluenceAttachmentCount {
  return {
    attachmentId: proto.attachmentId!,
    domainOfInfluence: proto.domainOfInfluence?.toObject() as DomainOfInfluence,
    requiredCount: proto.requiredCount?.value,
    requiredForVoterListsCount: proto.requiredForVoterListsCount!,
  };
}

export function mapDomainOfInfluenceAttachmentCategorySummariesEntry(
  entryProto: DomainOfInfluenceAttachmentCategorySummariesEntryProto,
): DomainOfInfluenceAttachmentCategorySummariesEntry {
  const entry: DomainOfInfluenceAttachmentCategorySummariesEntry = {
    domainOfInfluence: entryProto.domainOfInfluence?.toObject() as DomainOfInfluence,
    attachmentCategorySummaries: (entryProto.attachmentCategorySummaries ?? []).map(e => mapAttachmentCategorySummary(e)),
    politicalBusinesses: (entryProto.politicalBusinesses ?? []).map(e => mapPoliticalBusiness(e)),
  };
  mapAttachmentsPbIdsToCheckablePbs(entry.attachmentCategorySummaries, entry.politicalBusinesses);
  return entry;
}

export function mapDomainOfInfluenceAttachmentCategorySummariesEntries(
  entriesProto: DomainOfInfluenceAttachmentCategorySummariesEntriesProto,
): DomainOfInfluenceAttachmentCategorySummariesEntry[] {
  return (entriesProto.entries ?? []).map(e => mapDomainOfInfluenceAttachmentCategorySummariesEntry(e));
}

function mapAttachmentsPbIdsToCheckablePbs(
  attachmentCategorySummaries: AttachmentCategorySummary[],
  politicalBusinesses: PoliticalBusiness[],
): void {
  for (const attachmentCategorySummary of attachmentCategorySummaries) {
    for (const attachment of attachmentCategorySummary.attachments) {
      mapAttachmentPbIdsToCheckablePbs(attachment, politicalBusinesses);
    }
  }
}

export function mapToAttachmentTableEntries(summaries: AttachmentCategorySummary[]): AttachmentTableEntry[] {
  const entries = [] as (Attachment | AttachmentCategorySummary)[];

  for (const summary of summaries) {
    entries.push(summary);

    for (const attachment of summary.attachments) {
      entries.push(attachment);
    }
  }

  return entries;
}

export function mapAttachmentPbIdsToCheckablePbs(attachment: Attachment, politicalBusinesses: PoliticalBusiness[]) {
  attachment.checkablePoliticalBusinesses = new CheckableItems(
    politicalBusinesses.map(pb => ({
      checked: attachment.politicalBusinessIds.includes(pb.id),
      item: pb,
    })),
    {
      disabledWhenOnlyOneChecked: true,
    },
  );
}
