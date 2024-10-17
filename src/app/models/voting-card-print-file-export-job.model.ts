/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardPrintFileExportJob as VotingCardPrintFileExportJobProto } from '@abraxas/voting-stimmunterlagen-proto';
import { ExportJobState } from './export-job-state.model';

export { VotingCardPrintFileExportJobProto };

export interface VotingCardPrintFileExportJob {
  id: string;
  fileName: string;
  state: ExportJobState;
}
