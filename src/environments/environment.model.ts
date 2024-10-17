/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AUDIENCE_CLIENTID_PREFIX, AuthorizationConfig, DEFAULT_SCOPE, UserConfig } from '@abraxas/base-components';
import { TenantConfig } from '@abraxas/base-components/lib/services/models/tenant-config.model';
import { Environments } from '@abraxas/voting-lib';
import { AuthConfig } from 'angular-oauth2-oidc';

export interface Environment extends TenantConfig, UserConfig, AuthorizationConfig {
  production: boolean;
  hmr: boolean;
  env: Environments;
  authenticationConfig: AuthConfig & Required<Pick<AuthConfig, 'clientId' | 'issuer' | 'scope'>>;
  authAllowedUrls?: string[];
  grpcApiEndpoint: string;
  restApiEndpoint: string;
  dmDocBaseUrl: string;
}

export function buildScope(...clientIds: string[]): string {
  return [DEFAULT_SCOPE, 'offline_access', ...clientIds.map(cid => AUDIENCE_CLIENTID_PREFIX + cid)].join(' ');
}
