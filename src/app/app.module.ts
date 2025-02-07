/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AppHeaderBarIamModule,
  AppHeaderBarModule,
  AuthenticationModule,
  AuthorizationModule,
  AuthStorageService,
  BreadcrumbItemModule,
  BreadcrumbsModule,
  SnackbarModule,
  TenantModule,
  UserModule,
  RoleModule,
  AppLayoutModule,
} from '@abraxas/base-components';
import { DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GRPC_INTERCEPTORS, GrpcCoreModule, GrpcLoggerModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { OAuthModule, OAuthStorage } from 'angular-oauth2-oidc';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { BreadcrumbBarComponent } from './app/components/breadcrumb-bar/breadcrumb-bar.component';
import { AppComponent } from './app/pages/app/app.component';
import { GrpcAuthInterceptor } from './services/interceptors/grpc-auth.interceptor';
import { GrpcErrorToastInterceptor } from './services/interceptors/grpc-error-toast.interceptor';
import { GrpcTenantInterceptor } from './services/interceptors/grpc-tenant-interceptor.service';
import { RestErrorToastInterceptor } from './services/interceptors/rest-error-toast.interceptor';
import { RestTenantInterceptor } from './services/interceptors/rest-tenant.interceptor';
import { TranslationLoader } from './services/translation-loader';
import { SharedModule } from './shared/shared.module';
import { GrpcLanguageInterceptor } from './services/interceptors/grpc-language-interceptor.service';
import { RestLanguageInterceptor } from './services/interceptors/rest-language.interceptor';
import { LOCALE_ID } from '@angular/core';
import { RedirectByRolePageComponent } from './app/pages/redirect-by-role-page/redirect-by-role-page.component';
import { SelectRoleDialogComponent } from './app/dialog/select-role-dialog/select-role-dialog.component';
import { GrpcAppModuleInterceptor } from './services/interceptors/grpc-app-module-interceptor.service';
import { ENV_INJECTION_TOKEN, VotingLibModule } from '@abraxas/voting-lib';

@NgModule({
  declarations: [AppComponent, BreadcrumbBarComponent, RedirectByRolePageComponent, SelectRoleDialogComponent],
  imports: [
    SharedModule,
    AppRoutingModule,
    GrpcCoreModule.forRoot(),
    GrpcWebClientModule.forRoot({
      settings: { host: environment.grpcApiEndpoint },
    }),
    GrpcLoggerModule.forRoot({
      settings: {
        enabled: localStorage.getItem('GRPC_CONSOLE_LOGGER_ENABLED') === 'true' || !environment.production,
      },
    }),
    AuthenticationModule.forAuthentication(environment.authenticationConfig),
    AuthorizationModule.forAuthorization(environment),
    OAuthModule.forRoot({
      resourceServer: {
        allowedUrls: environment.authAllowedUrls ?? [],
        sendAccessToken: true,
      },
    }),
    UserModule.forRoot(environment),
    TenantModule.forRoot(environment),
    VotingLibModule.forRoot(environment.restApiEndpoint),
    BrowserModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: TranslationLoader,
      },
    }),
    SnackbarModule,
    BrowserAnimationsModule,
    AppHeaderBarIamModule,
    AppHeaderBarModule,
    MatDialogModule,
    BreadcrumbsModule,
    BreadcrumbItemModule,
    RoleModule,
    AppLayoutModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    DatePipe,
    {
      provide: ENV_INJECTION_TOKEN,
      useValue: environment.env,
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-CH',
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcErrorToastInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcAuthInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcTenantInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcLanguageInterceptor,
    },
    {
      provide: GRPC_INTERCEPTORS,
      multi: true,
      useClass: GrpcAppModuleInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: RestTenantInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: RestErrorToastInterceptor,
    },
    {
      provide: HTTP_INTERCEPTORS,
      multi: true,
      useClass: RestLanguageInterceptor,
    },
    {
      provide: OAuthStorage,
      useClass: AuthStorageService,
    },
  ],
})
export class AppModule {}
