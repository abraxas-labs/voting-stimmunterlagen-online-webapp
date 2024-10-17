/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthStorageService } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { GrpcEvent, GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler } from '@ngx-grpc/core';
import { GrpcInterceptor } from '@ngx-grpc/core/lib/grpc-interceptor';
import { Observable } from 'rxjs';

const authorizationKey = 'Authorization';
const bearerPrefix = 'Bearer ';
const accessTokenStorageField = 'access_token';

function noAccessTokenPresent(): never {
  throw new Error('Access Token is null.');
}

@Injectable({
  providedIn: 'root',
})
export class GrpcAuthInterceptor implements GrpcInterceptor {
  constructor(private readonly authStorage: AuthStorageService) {}

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>> {
    if (request.requestMetadata.has(authorizationKey)) {
      return next.handle(request);
    }

    const accessToken = this.authStorage.getItem(accessTokenStorageField);
    if (!accessToken) {
      noAccessTokenPresent();
    }

    request.requestMetadata.set(authorizationKey, bearerPrefix + accessToken);
    return next.handle(request);
  }
}
