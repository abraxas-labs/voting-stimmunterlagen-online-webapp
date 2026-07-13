/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VoterListImportWithElectoralRegisterResponse as VoterListImportWithElectoralRegisterResponseProto } from '@abraxas/voting-stimmunterlagen-proto';
import { VoterListImportError, VoterListImportVoterListResponse } from './voter-list-import.model';

export { VoterListImportWithElectoralRegisterResponseProto };

export interface VoterListImportWithElectoralRegisterResponse extends Omit<
  Required<VoterListImportWithElectoralRegisterResponseProto.AsObject>,
  'voterLists' | 'error' | 'lastUpdate'
> {
  voterLists: VoterListImportVoterListResponse[];
  error?: VoterListImportError;
  lastUpdate: Date;
}

export function mapVoterListImportWithElectoralRegisterResponse(
  proto: VoterListImportWithElectoralRegisterResponseProto,
): VoterListImportWithElectoralRegisterResponse {
  return {
    ...proto.toObject(),
    lastUpdate: proto.lastUpdate!.toDate(),
  } as VoterListImportWithElectoralRegisterResponse;
}
