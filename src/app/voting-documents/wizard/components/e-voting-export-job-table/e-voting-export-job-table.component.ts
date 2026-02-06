/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ContestEVotingExportJob } from '../../../../models/e-voting-export-job.model';

@Component({
  selector: 'app-e-voting-export-job-table',
  templateUrl: './e-voting-export-job-table.component.html',
  styleUrls: ['./e-voting-export-job-table.component.scss'],
  standalone: false,
})
export class EVotingExportJobTableComponent {
  public readonly columns = ['fileName', 'fileHash', 'state'];

  @Input()
  public jobs: ContestEVotingExportJob[] = [];
}
