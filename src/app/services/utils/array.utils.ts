/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export function groupBySingle<E, K extends keyof any, V>(
  arr: E[],
  keySelector: (item: E) => K,
  itemSelector: (item: E) => V,
): Record<K, V> {
  return arr.reduce(
    (existing, current) => {
      const key = keySelector(current);
      existing[key] = itemSelector(current);
      return existing;
    },
    {} as Record<K, V>,
  );
}

export function groupBy<E, K extends keyof any>(arr: E[], keySelector: (item: E) => K): Record<K, E[]> {
  return arr.reduce(
    (existing, current) => {
      const key = keySelector(current);
      if (!existing.hasOwnProperty(key)) {
        existing[key] = [];
      }
      existing[key].push(current);
      return existing;
    },
    {} as Record<K, E[]>,
  );
}

export function flatten<E>(arr: E[][]): E[] {
  return Array.prototype.concat.apply([], arr);
}

export function distinct<E>(arr: E[]): E[] {
  return arr.filter((value, index) => arr.indexOf(value) === index);
}

export function sum<E>(arr: E[], propSelector: (item: E) => number): number {
  return arr.reduce((v, x) => v + propSelector(x), 0);
}
