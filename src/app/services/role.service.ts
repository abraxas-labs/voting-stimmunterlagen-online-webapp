/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { RoleService as IamRoleService } from '@abraxas/base-components';
import { firstValueFrom, Observable } from 'rxjs';
import { Roles } from '../models/roles.model';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private readonly roles = inject(IamRoleService);

  public get isElectionAdmin$(): Observable<boolean> {
    return this.roles.hasRole([Roles.ElectionAdmin]);
  }

  public get isPrintJobManager$(): Observable<boolean> {
    return this.roles.hasRole([Roles.PrintJobManager]);
  }

  public isElectionAdmin(): Promise<boolean> {
    return firstValueFrom(this.isElectionAdmin$.pipe(first()));
  }

  public isPrintJobManager(): Promise<boolean> {
    return firstValueFrom(this.isPrintJobManager$.pipe(first()));
  }
}
