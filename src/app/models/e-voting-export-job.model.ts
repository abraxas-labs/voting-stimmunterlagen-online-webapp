/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ExportJobState } from './export-job-state.model';

export interface ContestEVotingExportJob {
  id: string;
  fileName: string;
  fileHash: string;
  state: ExportJobState;
}
