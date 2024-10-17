/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VoterListImportWithElectoralRegisterResponse as VoterListImportWithElectoralRegisterResponseProto } from '@abraxas/voting-stimmunterlagen-proto';
import { VoterListImportVoterListResponse } from './voter-list-import.model';
import { VoterDuplicate } from './voter.model';

export { VoterListImportWithElectoralRegisterResponseProto };

export interface VoterListImportWithElectoralRegisterResponse
  extends Omit<Required<VoterListImportWithElectoralRegisterResponseProto.AsObject>, 'voterLists' | 'voterDuplicates'> {
  voterLists: VoterListImportVoterListResponse[];
  voterDuplicates: VoterDuplicate[];
}

export function mapVoterListImportWithElectoralRegisterResponse(
  proto: VoterListImportWithElectoralRegisterResponseProto,
): VoterListImportWithElectoralRegisterResponse {
  return {
    ...proto.toObject(),
  } as VoterListImportWithElectoralRegisterResponse;
}
