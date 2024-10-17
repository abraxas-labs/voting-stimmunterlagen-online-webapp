/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AttachmentCategory, AttachmentTableEntry } from '../../models/attachment.model';

const categoriesOrder: AttachmentCategory[] = [
  AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_CH,
  AttachmentCategory.ATTACHMENT_CATEGORY_BROCHURE_CH,
  AttachmentCategory.ATTACHMENT_CATEGORY_VOTING_GUIDE_CH,
  AttachmentCategory.ATTACHMENT_CATEGORY_OTHER_CH,
  AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_CT,
  AttachmentCategory.ATTACHMENT_CATEGORY_BROCHURE_CT,
  AttachmentCategory.ATTACHMENT_CATEGORY_VOTING_GUIDE_CT,
  AttachmentCategory.ATTACHMENT_CATEGORY_OTHER_CT,
  AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_MU,
  AttachmentCategory.ATTACHMENT_CATEGORY_BROCHURE_MU,
  AttachmentCategory.ATTACHMENT_CATEGORY_VOTING_GUIDE_MU,
  AttachmentCategory.ATTACHMENT_CATEGORY_OTHER_MU,
  AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_ALL,
  AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_ENVELOPE_CUSTOM,
  AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_ENVELOPE_STANDARD,
];

export function isAttachment(entry: AttachmentTableEntry): boolean {
  return !!(entry as any).id;
}

export function showRequiredForVoterListsCount(entry: AttachmentTableEntry): boolean {
  const category = entry.category;
  const isSummary = !isAttachment(entry);

  const hideSummaryRequiredForVoterListsCount =
    category === AttachmentCategory.ATTACHMENT_CATEGORY_BROCHURE_MU ||
    category === AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_MU ||
    category === AttachmentCategory.ATTACHMENT_CATEGORY_BALLOT_ENVELOPE_CUSTOM ||
    category === AttachmentCategory.ATTACHMENT_CATEGORY_OTHER_MU ||
    category === AttachmentCategory.ATTACHMENT_CATEGORY_VOTING_GUIDE_MU;

  // on "Gemeinde" categories, the required for voter lists count is visible only on the attachment, not on the summary
  // on all other categories, the required for voter lists count is visible only on the summary, not on the attachment
  return (isSummary && !hideSummaryRequiredForVoterListsCount) || (!isSummary && hideSummaryRequiredForVoterListsCount);
}

export function sortByCategory<T>(selector: (v: T) => AttachmentCategory, items: T[]): void {
  items.sort((a, b) => categoriesOrder.indexOf(selector(a)) - categoriesOrder.indexOf(selector(b)));
}
