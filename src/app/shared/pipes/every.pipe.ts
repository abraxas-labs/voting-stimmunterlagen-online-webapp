/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'every',
})
export class EveryPipe<T> implements PipeTransform {
  public transform(items: T[], key?: keyof T, value?: any): boolean {
    value ??= true;
    let anyItems: any[] = items;

    if (key) {
      anyItems = items.map(x => x[key]);
    }

    return anyItems.every(x => x === value);
  }
}
