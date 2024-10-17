/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Component, ContentChildren, Input, QueryList } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridTableItemComponent } from './grid-table-item/grid-table-item.component';

@Component({
  selector: 'app-grid-table',
  templateUrl: './grid-table.component.html',
  styleUrls: ['./grid-table.component.scss'],
})
export class GridTableComponent implements OnDestroy, AfterViewInit {
  private gridTemplateItemsDirectionStyleValue = '';
  private gridTemplateEntriesDirectionStyleValue = '';
  private itemsValue?: QueryList<GridTableItemComponent>;

  private itemsChangesSubscription?: Subscription;

  @Input()
  public itemOrientation: 'horizontal' | 'vertical' = 'horizontal';

  public get gridTemplateItemsDirectionStyle(): string {
    return this.gridTemplateItemsDirectionStyleValue;
  }

  // only set once on init, depends on how many entries the first grid-table-item has
  public get gridTemplateEntriesDirectionStyle(): string {
    return this.gridTemplateEntriesDirectionStyleValue;
  }

  public get items(): QueryList<GridTableItemComponent> | undefined {
    return this.itemsValue;
  }

  @ContentChildren(GridTableItemComponent)
  public set items(v: QueryList<GridTableItemComponent> | undefined) {
    if (v === this.itemsValue) {
      return;
    }

    this.itemsValue = v;

    if (!this.itemsValue) {
      return;
    }

    this.refreshGridTemplateItemsDirectionStyle();

    this.itemsChangesSubscription = this.itemsValue.changes.subscribe(() => {
      this.refreshGridTemplateItemsDirectionStyle();
    });
  }

  constructor(private readonly cd: ChangeDetectorRef) {}

  public ngOnDestroy(): void {
    this.itemsChangesSubscription?.unsubscribe();
  }

  public ngAfterViewInit(): void {
    this.refreshGridTemplateEntriesDirectionStyle();
    this.cd.detectChanges();
  }

  private refreshGridTemplateItemsDirectionStyle(): void {
    this.gridTemplateItemsDirectionStyleValue = `repeat(${this.itemsValue!.length}, min-content)`;
  }

  private refreshGridTemplateEntriesDirectionStyle(): void {
    this.gridTemplateEntriesDirectionStyleValue = `repeat(${this.itemsValue!.first.itemEntries.length}, min-content)`;
  }
}
