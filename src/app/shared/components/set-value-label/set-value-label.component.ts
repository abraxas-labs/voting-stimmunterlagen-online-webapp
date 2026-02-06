/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-set-value-label',
  templateUrl: './set-value-label.component.html',
  styleUrls: ['./set-value-label.component.scss'],
  standalone: false,
})
export class SetValueLabelComponent<T> {
  @Input()
  public value?: T;

  @Input()
  public label?: string;

  @Output()
  public setValue: EventEmitter<void> = new EventEmitter();
}
