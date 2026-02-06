/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export interface EnumItem<T> {
  key: string;
  value: T;
}

export interface EnumItemDescription<T> {
  value: T;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class EnumUtil {
  private readonly i18n = inject(TranslateService);

  public getArrayWithDescriptions<T>(enumObj: object | undefined, i18nPrefix: string): EnumItemDescription<T>[] {
    const items = this.getArrayWithDescriptionsWithUnspecified<T>(enumObj, i18nPrefix);
    return items.filter(i => (i.value as any) !== 0);
  }

  public getArrayWithDescriptionsWithUnspecified<T>(enumObj: object | undefined, i18nPrefix: string): EnumItemDescription<T>[] {
    if (!enumObj) {
      return [];
    }

    return this.getEnumValues(enumObj).map(value => ({
      value,
      description: this.i18n.instant(i18nPrefix + value),
    }));
  }

  private getEnumValues(enumObj: object): any[] {
    const enumValues = Object.values(enumObj);
    // first half of values are the names (ex: {"0": "UNDEFINED", "UNDEFINED": 0}])
    const mid = Math.ceil(enumValues.length / 2);
    return enumValues.slice(mid);
  }
}
