/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, OnDestroy, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { from, Observable, of, Subscription } from 'rxjs';
import { DomainOfInfluence } from '../../models/domain-of-influence.model';
import { DomainOfInfluenceService } from '../domain-of-influence.service';
import { filter, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceResolver implements OnDestroy {
  private readonly domainOfInfluenceService = inject(DomainOfInfluenceService);

  private domainOfInfluenceUpdatedSubscription?: Subscription;
  private cachedDomainOfInfluence?: DomainOfInfluence;

  public resolve: ResolveFn<DomainOfInfluence> = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<DomainOfInfluence> => {
    const id = route.paramMap.get('domainOfInfluenceId');
    if (!id) {
      throw new Error('domainOfInfluenceId not set');
    }

    if (this.cachedDomainOfInfluence?.id === id) {
      return of(this.cachedDomainOfInfluence);
    }

    this.domainOfInfluenceUpdatedSubscription?.unsubscribe();

    this.domainOfInfluenceUpdatedSubscription = this.domainOfInfluenceService.domainOfInfluenceWithIdSettingsUpdated
      .pipe(
        filter(doiId => doiId === id),
        switchMap(() => {
          delete this.cachedDomainOfInfluence;
          return of(null);
        }),
      )
      .subscribe();

    return from(this.domainOfInfluenceService.get(id)).pipe(
      tap(doi => {
        this.cachedDomainOfInfluence = doi;
      }),
    );
  };

  public ngOnDestroy(): void {
    this.domainOfInfluenceUpdatedSubscription?.unsubscribe();
  }
}
