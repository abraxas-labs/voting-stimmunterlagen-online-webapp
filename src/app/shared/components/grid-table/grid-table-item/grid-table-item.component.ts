/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ContentChildren, QueryList } from '@angular/core';
import { GridTableItemEntryComponent } from '../grid-table-item-entry/grid-table-item-entry.component';

@Component({
  selector: 'app-grid-table-item',
  templateUrl: './grid-table-item.component.html',
  styleUrls: ['./grid-table-item.component.scss'],
  standalone: false,
})
export class GridTableItemComponent {
  @ContentChildren(GridTableItemEntryComponent)
  public readonly itemEntries!: QueryList<GridTableItemEntryComponent>;
}
