/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthorizationService, Tenant } from '@abraxas/base-components';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { from, Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const tenantKey = 'x-tenant';

@Injectable({
  providedIn: 'root',
})
export class RestTenantInterceptor implements HttpInterceptor, OnDestroy {
  private readonly restApiEndpoint = environment.restApiEndpoint;
  private readonly tenantSubscription: Subscription;
  private tenant?: Tenant;

  constructor(private readonly authorization: AuthorizationService) {
    this.tenantSubscription = authorization.activeTenantChanged.subscribe(t => (this.tenant = t));
  }

  public ngOnDestroy(): void {
    this.tenantSubscription.unsubscribe();
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(this.restApiEndpoint)) {
      return next.handle(req);
    }

    return from(this.ensureTenant()).pipe(
      map(t => this.setTenantIfNotSet(t, req)),
      switchMap(req => next.handle(req)),
    );
  }

  private setTenantIfNotSet(t: Tenant, request: HttpRequest<any>): HttpRequest<any> {
    if (!request.headers.has(tenantKey)) {
      return request.clone({
        setHeaders: { [tenantKey]: t.id },
      });
    }

    return request;
  }

  private async ensureTenant(): Promise<Tenant> {
    if (this.tenant) {
      return this.tenant;
    }

    return (this.tenant = await this.authorization.getActiveTenant());
  }
}
