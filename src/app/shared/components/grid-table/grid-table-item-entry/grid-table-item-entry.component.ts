/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-grid-table-item-entry',
  templateUrl: './grid-table-item-entry.component.html',
  styleUrls: ['./grid-table-item-entry.component.scss'],
})
export class GridTableItemEntryComponent {
  @Input()
  public borderVariant: 'none' | 'default' | 'bold' = 'default';
}
