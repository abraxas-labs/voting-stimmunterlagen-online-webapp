/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, Output, EventEmitter } from '@angular/core';
import { VoterListImport } from '../../../../models/voter-list-import.model';

@Component({
  selector: 'app-voter-list-import-edit-form',
  templateUrl: './voter-list-import-edit-form.component.html',
})
export class VoterListImportEditFormComponent {
  @Input()
  public voterListImport!: VoterListImport;

  @Input()
  public step = 0;

  @Output()
  public stepChange: EventEmitter<number> = new EventEmitter<number>();
}
