/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { VotingCardGeneratorJob } from '../../../models/voting-card-generator-job.model';

@Component({
  selector: 'app-voting-card-generator-job-table',
  templateUrl: './voting-card-generator-job-table.component.html',
  styleUrls: ['./voting-card-generator-job-table.component.scss'],
})
export class VotingCardGeneratorJobTableComponent {
  @Input()
  public jobs: VotingCardGeneratorJob[] = [];
}
