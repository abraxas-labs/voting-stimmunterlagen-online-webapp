/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Ech0045Version } from '@abraxas/voting-stimmunterlagen-proto';
import { ExportJobState } from './export-job-state.model';

export interface ContestEVotingExportJob {
  id: string;
  fileName: string;
  fileHash: string;
  state: ExportJobState;
  ech0045Version: Ech0045Version;
}
