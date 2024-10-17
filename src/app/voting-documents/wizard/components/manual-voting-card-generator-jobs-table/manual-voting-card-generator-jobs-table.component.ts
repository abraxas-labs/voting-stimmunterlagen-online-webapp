/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ManualVotingCardGeneratorJob } from '../../../../models/manual-voting-card-generator-job.model';

@Component({
  selector: 'app-manual-voting-card-generator-jobs-table',
  templateUrl: './manual-voting-card-generator-jobs-table.component.html',
  styleUrls: ['./manual-voting-card-generator-jobs-table.component.scss'],
})
export class ManualVotingCardGeneratorJobsTableComponent {
  @Input()
  public jobs: ManualVotingCardGeneratorJob[] = [];
}
