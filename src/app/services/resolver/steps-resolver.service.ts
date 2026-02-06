/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { from, Observable } from 'rxjs';
import { StepState } from '../../models/step.model';
import { StepService } from '../step.service';

@Injectable({
  providedIn: 'root',
})
export class StepsResolver {
  private readonly stepService = inject(StepService);

  public resolve: ResolveFn<StepState[]> = (route: ActivatedRouteSnapshot): Observable<StepState[]> => {
    const id = route.paramMap.get('domainOfInfluenceId');
    if (!id) {
      throw new Error('domainOfInfluenceId not set');
    }

    return from(this.stepService.list(id));
  };
}
