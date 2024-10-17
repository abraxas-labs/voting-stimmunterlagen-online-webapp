/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable } from '@angular/core';
import { GrpcEvent, GrpcMessage, GrpcRequest } from '@ngx-grpc/common';
import { GrpcHandler } from '@ngx-grpc/core';
import { GrpcInterceptor } from '@ngx-grpc/core/lib/grpc-interceptor';
import { Observable } from 'rxjs';
import { LanguageService } from '../language.service';

const languageKey = 'x-language';

@Injectable({
  providedIn: 'root',
})
export class GrpcLanguageInterceptor implements GrpcInterceptor {
  constructor(private readonly languageService: LanguageService) {}

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>> {
    request.requestMetadata.set(languageKey, this.languageService.currentLanguage);
    return next.handle(request);
  }
}
