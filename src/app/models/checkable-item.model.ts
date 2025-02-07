/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface CheckableItem<T> {
  checked: boolean;
  item: T;
  disabled?: boolean;
}

export interface CheckableItemsConfig {
  disabledWhenOnlyOneChecked: boolean;
}

export class CheckableItems<T> {
  private readonly config: CheckableItemsConfig;
  private atLeastOneCheckedValue = false;
  private allCheckedValue = false;

  public set allChecked(v: boolean) {
    this.items.forEach(i => (i.checked = v));
    this.refreshState();
  }

  public get atLeastOneChecked(): boolean {
    return this.atLeastOneCheckedValue;
  }

  public get allChecked(): boolean {
    return this.allCheckedValue;
  }

  public get checkedItems(): T[] {
    return this.items.filter(i => i.checked).map(i => i.item);
  }

  public static buildFromRecords<T>(
    items: Record<string, CheckableItem<T>[]>,
    config?: CheckableItemsConfig,
  ): Record<string, CheckableItems<T>> {
    const res = {} as Record<string, CheckableItems<T>>;
    Object.entries(items).forEach(([key, value]) => (res[key] = new CheckableItems(value, config)));
    return res;
  }

  public refreshState(): void {
    const checkedItems = this.items.filter(i => i.checked);

    this.allCheckedValue = this.items.length === checkedItems.length;

    if (checkedItems.length === 0) {
      this.atLeastOneCheckedValue = false;
      return;
    }

    this.atLeastOneCheckedValue = true;

    if (!this.config.disabledWhenOnlyOneChecked) {
      return;
    }

    if (checkedItems.length === 1) {
      checkedItems[0].disabled = true;
      return;
    }

    for (const item of this.items) {
      item.disabled = false;
    }
  }

  public updateChecked(item: CheckableItem<T>, checked: boolean) {
    item.checked = checked;
    this.refreshState();
  }

  constructor(
    public items: CheckableItem<T>[],
    config?: CheckableItemsConfig,
  ) {
    this.config = config ?? { disabledWhenOnlyOneChecked: false };
    this.refreshState();
  }
}
