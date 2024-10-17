/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { CheckableItems } from '../../models/checkable-item.model';
import { PoliticalBusiness } from '../../models/political-business.model';
import { VoterListImport, VoterListImportVoterListResponse } from '../../models/voter-list-import.model';
import { VoterList } from '../../models/voter-list.model';

export function addCheckablePoliticalBusinessesToVoterLists(voterLists: VoterList[], politicalBusinesses: PoliticalBusiness[]): void {
  for (const voterList of voterLists) {
    addCheckablePoliticalBusinessesToVoterList(voterList, politicalBusinesses);
  }
}

export function mapVoterListImportResponseToImport(
  voterListImport: VoterListImport,
  newVoterLists: VoterListImportVoterListResponse[],
  politicalBusinesses: PoliticalBusiness[],
  allPoliticalBusinessesChecked: boolean,
) {
  let previousVoterLists = voterListImport.voterLists ?? [];
  voterListImport.voterLists = newVoterLists.map(voterListResponse => ({
    ...voterListResponse,
    importId: voterListImport.id,
    lastUpdate: voterListImport.lastUpdate,
    name: voterListImport.name,
    source: voterListImport.source,
    hasVoterDuplicates: voterListResponse.voterDuplicates.length > 0,
    politicalBusinessIds: previousVoterLists.find(vl => vl.votingCardType === voterListResponse.votingCardType)?.politicalBusinessIds ?? [],
    checkablePoliticalBusinesses: {} as CheckableItems<PoliticalBusiness>,
  }));

  for (const voterList of voterListImport.voterLists) {
    // set count to 0 because the REST response does not set this field.
    voterList.countOfSendVotingCardsToDomainOfInfluenceReturnAddress ??= 0;
  }

  addCheckablePoliticalBusinessesToVoterLists(voterListImport.voterLists, politicalBusinesses);

  if (allPoliticalBusinessesChecked) {
    for (const voterList of voterListImport.voterLists) {
      voterList.checkablePoliticalBusinesses.allChecked = true;
    }
  }
}

function addCheckablePoliticalBusinessesToVoterList(voterList: VoterList, politicalBusinesses: PoliticalBusiness[]): void {
  voterList.checkablePoliticalBusinesses = new CheckableItems(
    politicalBusinesses.map(pb => ({
      checked: voterList.politicalBusinessIds.includes(pb.id),
      item: pb,
    })),
    {
      disabledWhenOnlyOneChecked: true,
    },
  );
}
