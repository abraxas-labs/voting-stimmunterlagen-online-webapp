/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, inject } from '@angular/core';
import { GrpcEvent, GrpcMessage, GrpcRequest, GrpcStatusEvent } from '@ngx-grpc/common';
import { GrpcHandler, GrpcInterceptor } from '@ngx-grpc/core';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom, Observable, of, throwError } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root',
})
export class GrpcErrorToastInterceptor implements GrpcInterceptor {
  private readonly i18n = inject(TranslateService);
  private readonly toast = inject(ToastService);

  public intercept<Q extends GrpcMessage, S extends GrpcMessage>(request: GrpcRequest<Q, S>, next: GrpcHandler): Observable<GrpcEvent<S>> {
    return next
      .handle(request)
      .pipe(switchMap(event => (event instanceof GrpcStatusEvent && event.statusCode ? this.handleGrpcError(event) : of(event))));
  }

  private handleGrpcError(err: GrpcStatusEvent): Observable<never> {
    // async workflow is needed
    // if the first api call fails, the translations aren't loaded yet...
    const titlePromise = this.tryTranslationKeys(err, `ERRORS.${err.statusCode}.TITLE`, 'ERRORS.GENERIC.TITLE');
    const msgPromise = this.tryTranslationKeys(err, `ERRORS.${err.statusCode}.MESSAGE`, 'ERRORS.GENERIC.MESSAGE');
    Promise.all([titlePromise, msgPromise]).then(([title, msg]) => this.toast.error(title, msg));
    return throwError(err);
  }

  private async tryTranslationKeys(interpolateParams?: any, ...keys: string[]): Promise<string> {
    for (const key of keys) {
      const translated = await firstValueFrom(this.i18n.get(key, interpolateParams));
      if (translated !== key) {
        return translated;
      }
    }
    return keys[keys.length - 1];
  }
}
