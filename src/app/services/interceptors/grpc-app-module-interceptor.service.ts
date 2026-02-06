/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { GrpcEvent, GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler, GrpcInterceptor } from '@ngx-grpc/core';
import { Observable } from 'rxjs';
import { AppContext } from '../app.context';

const appKey = 'x-vo-stimmunterlagen-app-module';

@Injectable({
  providedIn: 'root',
})
export class GrpcAppModuleInterceptor implements GrpcInterceptor {
  private readonly appContext = inject(AppContext);

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>> {
    request.requestMetadata.set(appKey, this.appContext.appName);
    return next.handle(request);
  }
}
