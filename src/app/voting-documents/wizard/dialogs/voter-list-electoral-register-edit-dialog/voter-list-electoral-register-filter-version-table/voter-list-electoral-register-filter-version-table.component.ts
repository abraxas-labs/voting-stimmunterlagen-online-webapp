/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { ElectoralRegisterFilterVersion } from '../../../../../models/filter.model';

@Component({
  selector: 'app-voter-list-electoral-register-filter-version-table',
  templateUrl: './voter-list-electoral-register-filter-version-table.component.html',
  styleUrls: ['./voter-list-electoral-register-filter-version-table.component.scss'],
})
export class VoterListElectoralRegisterFilterVersionTableComponent {
  public readonly versionColumns = ['name', 'deadline', 'numberOfPersons', 'createdBy', 'createdAt', 'numberOfInvalidPersons'];

  @Input()
  public selectedFilterVersionId?: string;

  @Input()
  public filterVersions?: ElectoralRegisterFilterVersion[];
}
