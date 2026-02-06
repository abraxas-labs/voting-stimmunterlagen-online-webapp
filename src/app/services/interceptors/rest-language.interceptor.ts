/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LanguageService } from '../language.service';

const languageKey = 'x-language';

@Injectable({
  providedIn: 'root',
})
export class RestLanguageInterceptor implements HttpInterceptor {
  private readonly languageService = inject(LanguageService);

  private readonly restApiEndpoint = environment.restApiEndpoint;

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!req.url.includes(this.restApiEndpoint)) {
      return next.handle(req);
    }

    req = req.clone({
      setHeaders: { [languageKey]: this.languageService.currentLanguage },
    });
    return next.handle(req);
  }
}
