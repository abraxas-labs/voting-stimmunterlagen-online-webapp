/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { VotingCardPrintFileExportJob } from '../../../models/voting-card-print-file-export-job.model';

@Component({
  selector: 'app-voting-card-print-file-export-job-table',
  templateUrl: './voting-card-print-file-export-job-table.component.html',
  styleUrls: ['./voting-card-print-file-export-job-table.component.scss'],
})
export class VotingCardPrintFileExportJobTableComponent {
  public readonly columns = ['fileName', 'state'];

  @Input()
  public jobs: VotingCardPrintFileExportJob[] = [];
}
