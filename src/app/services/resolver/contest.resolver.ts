/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { Contest } from '../../models/contest.model';
import { ContestService } from '../contest.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ContestResolver {
  private cachedContest?: Contest;

  constructor(private readonly contestService: ContestService) {}

  public resolve: ResolveFn<Contest> = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Contest> => {
    const id = route.paramMap.get('contestId');
    if (!id) {
      throw new Error('contestId not set');
    }

    // this resolver is run with the always strategy,
    // but this resolver doesn't need to run always
    // (strategy is set to always due to the DOI resolver)
    // therefore cache the contest
    if (this.cachedContest?.id === id) {
      return of(this.cachedContest);
    }

    return from(this.contestService.get(id)).pipe(
      tap(v => {
        this.cachedContest = v;
      }),
    );
  };
}
