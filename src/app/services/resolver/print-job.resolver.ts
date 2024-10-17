/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { from, Observable } from 'rxjs';
import { PrintJob } from '../../models/print-job.model';
import { PrintJobService } from '../print-job.service';

@Injectable({
  providedIn: 'root',
})
export class PrintJobResolver {
  constructor(private readonly printJobService: PrintJobService) {}

  public resolve: ResolveFn<PrintJob> = (route: ActivatedRouteSnapshot): Observable<PrintJob> => {
    const id = route.paramMap.get('domainOfInfluenceId');
    if (!id) {
      throw new Error('domainOfInfluenceId not set');
    }

    return from(this.printJobService.get(id));
  };
}
