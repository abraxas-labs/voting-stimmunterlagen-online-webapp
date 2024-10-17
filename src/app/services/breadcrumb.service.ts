/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DatePipe, LocationStrategy } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { BreadcrumbItem } from '../models/breadcrumb-item.model';
import { ThemeService } from '@abraxas/voting-lib';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  private readonly breadcrumbItems: Subject<BreadcrumbItem[]> = new BehaviorSubject<BreadcrumbItem[]>([]);
  private theme?: string;

  constructor(
    router: Router,
    route: ActivatedRoute,
    private readonly dateFormatter: DatePipe,
    locationStrategy: LocationStrategy,
    themeService: ThemeService,
  ) {
    themeService.theme$.subscribe(theme => (this.theme = theme));

    router.events
      .pipe(
        filter(e => e instanceof NavigationEnd),
        map(() => {
          const breadcrumbItems: BreadcrumbItem[] = [];

          let childRoute = route.root;
          do {
            const data = childRoute.snapshot.data;
            const breadcrumbs = data.breadcrumbs as BreadcrumbItem[] | undefined;
            if (breadcrumbs !== undefined) {
              const mappedBreadcrumbs = breadcrumbs.map(b => ({
                ...b,
                i18nData: this.buildI18nData(data, b.i18nData),
                // URL base parameter needs a ending /, otherwise the relative url is of by 1 level
                link: b.relativeToCurrentRoute
                  ? new URL(b.link ?? '/', window.location.toString() + '/').pathname.replace(locationStrategy.getBaseHref(), '')
                  : `/${this.theme}${b.link ?? '/'}`,
              }));
              breadcrumbItems.push(...mappedBreadcrumbs);
            }
          } while (!!(childRoute = childRoute.firstChild!));
          return breadcrumbItems;
        }),
      )
      .subscribe(breadcrumbs => this.breadcrumbItems.next(breadcrumbs));
  }

  public get breadcrumbItems$(): Observable<BreadcrumbItem[]> {
    return this.breadcrumbItems.asObservable();
  }

  private buildI18nData(data: any, existingI18nData?: any): any {
    // special handling for the contest date since it needs to be formatted...
    const contestDate = this.dateFormatter.transform(data.contest?.date, 'dd.MM.yyyy');
    return {
      contestDate,
      ...data,
      ...(existingI18nData ?? {}),
    };
  }
}
