/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { VoterDuplicate } from '../../../../models/voter.model';

@Component({
  selector: 'app-voter-duplicate-table',
  templateUrl: './voter-duplicate-table.component.html',
  styleUrls: ['./voter-duplicate-table.component.scss'],
})
export class VoterDuplicateTableComponent {
  public readonly columns: string[] = ['personId', 'firstName', 'lastName', 'dateOfBirth'];

  @Input()
  public voterDuplicates?: VoterDuplicate[];
}
