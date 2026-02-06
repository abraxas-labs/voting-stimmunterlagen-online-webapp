/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-button-bar',
  templateUrl: './button-bar.component.html',
  styleUrls: ['./button-bar.component.scss'],
  standalone: false,
})
export class ButtonBarComponent {
  private readonly dialog = inject(DialogService);

  @Input()
  public saveLabel = 'APP.SAVE';

  @Input()
  public deleteLabel = 'APP.DELETE';

  @Input()
  public savingLabel?: string;

  @Input()
  public saving = false;

  @Input()
  public deleting = false;

  @Input()
  public canSave = true;

  @Input()
  public hasSaveButton = true;

  @Input()
  public hasCancelButton = true;

  @Input()
  public hasDeleteButton = true;

  @Input()
  public hasDeleteConfirm = true;

  @Input()
  public deleteConfirmLabel = 'APP.DELETE_CONFIRM';

  @Input()
  public saveColor: 'basic' | 'primary' | 'error' = 'primary';

  @Input()
  public saveVariant: 'primary' | 'secondary' | 'tertiary' = 'primary';

  @Output()
  public cancelEvent: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public save: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  public delete: EventEmitter<void> = new EventEmitter<void>();

  @Input()
  public sticky = true;

  public async deleteClick(): Promise<void> {
    if (!this.hasDeleteConfirm) {
      this.delete.emit();
      return;
    }

    const shouldDelete = await this.dialog.confirm('APP.DELETE', this.deleteConfirmLabel, 'APP.DELETE');

    if (!shouldDelete) {
      return;
    }

    this.delete.emit();
  }
}
