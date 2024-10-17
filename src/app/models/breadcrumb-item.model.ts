/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

export interface BreadcrumbItem {
  label: string;
  i18nData?: any;
  link?: string;
  // ensures that the current active route is used.
  // is required because the breadcrumb is not in a router-outlet context, so relative urls don't work by default.
  relativeToCurrentRoute?: boolean;
}
