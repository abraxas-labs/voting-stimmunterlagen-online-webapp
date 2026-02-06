/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VoterListImport as VoterListImportProto, VoterListSource } from '@abraxas/voting-stimmunterlagen-proto';
import { VoterList, mapVoterList } from './voter-list.model';
import { VoterListImportVoterListResponse as VoterListImportVoterListResponseProto } from '@abraxas/voting-stimmunterlagen-proto';
import { VoterDuplicate } from './voter.model';

export { VoterListImportProto, VoterListImportVoterListResponseProto };

export interface VoterListImportVoterListResponse extends Required<VoterListImportVoterListResponseProto.AsObject> {}

export interface VoterListImport extends Omit<Required<VoterListImportProto.AsObject>, 'lastUpdate' | 'voterLists'> {
  lastUpdate: Date;
  voterLists: VoterList[];
}

export interface VoterListImportResponse {
  importId: string;
  voterLists: VoterListImportVoterListResponse[];
  autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit: boolean;
  error?: VoterListImportError;
}

export interface VoterListImportError {
  voterDuplicates: VoterDuplicate[];
  voterDuplicatesCount: number;
}

export function mapVoterListImport(proto: VoterListImportProto): VoterListImport {
  return {
    ...(<Required<VoterListImportProto.AsObject>>proto.toObject()),
    lastUpdate: proto.lastUpdate!.toDate(),
    voterLists: proto.voterLists!.map(mapVoterList),
  };
}

export function newVoterListImport(source: VoterListSource): VoterListImport {
  return {
    source,
  } as VoterListImport;
}
