/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import * as moment from 'moment';

// util to convert dates to moment / strings required by the bc's.
// according to bc-people bc should accept dates directly in the next release.

export function toBcDate(date?: Date): string {
  return !date ? '' : moment(date).format('YYYY-MM-DD');
}

export function fromBcDate(bcDate?: string): Date | undefined {
  if (!bcDate) {
    return;
  }

  return moment(bcDate).utc(true).toDate();
}

export function addDays(date: Date, days: number): void {
  date.setDate(date.getDate() + days);
}

export function addHours(date: Date, hours: number): void {
  date.setHours(date.getHours() + hours);
}

// removes UTC Hours (ex: 2022-06-30T22:00:00Z => 2022-06-30T00:00:00Z).
// is required if the backend returns datetime but the front end handles it as date without time info.
export function toUTCDate(date: Date): void {
  addHours(date, -date.getUTCHours());
}

// converts an UTC date to the equivalent api/backend date (ex: 2022-06-30T00:00:00Z => 2022-06-30T22:00:00Z)
// is required to validate frontend deadlines
export function toApiDate(date: Date): void {
  addHours(date, 24 - date.getHours());
}
