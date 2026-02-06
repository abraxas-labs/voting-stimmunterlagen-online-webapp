/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { VoterListImport, VoterListImportError } from '../../../../models/voter-list-import.model';

@Component({
  selector: 'app-voter-list-import-edit-form',
  templateUrl: './voter-list-import-edit-form.component.html',
  standalone: false,
})
export class VoterListImportEditFormComponent {
  @Input()
  public voterListImport!: VoterListImport;

  @Input()
  public step = 0;

  @Input()
  public voterListImportError?: VoterListImportError;

  @Input()
  public electoralRegisterMultipleEnabled = false;

  @Output()
  public stepChange: EventEmitter<number> = new EventEmitter<number>();
}
