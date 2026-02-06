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
  standalone: false,
})
export class VoterDuplicateTableComponent {
  public readonly columns: string[] = ['firstName', 'lastName', 'dateOfBirth', 'street', 'houseNumber'];

  // If there are too many duplicates, the api only returns the count.
  @Input()
  public voterDuplicates?: VoterDuplicate[];

  @Input()
  public voterDuplicatesCount?: number;
}
