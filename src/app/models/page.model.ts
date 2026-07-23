/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { PageInfo as PageInfoProto } from '@abraxas/voting-stimmunterlagen-proto';

export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalItemsCount: number;
}

export interface Page<T> extends PageInfo {
  items: T[];
}

export interface Pageable {
  page: number;
  pageSize: number;
}

export const defaultPageable: Pageable = {
  page: 1,
  pageSize: 50,
};

export function emptyPage<T>(): Page<T> {
  return {
    items: [],
    currentPage: defaultPageable.page,
    pageSize: defaultPageable.pageSize,
    totalItemsCount: 0,
  };
}

export function mapToPage<T>(pageInfo: PageInfoProto, items: T[]): Page<T> {
  return {
    totalItemsCount: pageInfo.totalItemsCount!,
    currentPage: pageInfo.currentPage!,
    pageSize: pageInfo.pageSize!,
    items,
  };
}
