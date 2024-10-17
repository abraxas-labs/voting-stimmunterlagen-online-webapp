/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AuthenticationService } from '@abraxas/base-components';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class IamService {
  private user?: User;

  constructor(private readonly auth: AuthenticationService) {
    auth.authenticationChanged.subscribe(() => delete this.user);
  }

  public async getUser(): Promise<User> {
    if (this.user) {
      return this.user;
    }

    return (this.user = await this.auth.getUserProfile().then(u => ({
      secureConnectId: u.info.sub,
      userName: u.info.preferred_username,
      firstName: u.info.given_name,
      lastName: u.info.family_name,
    }))!);
  }
}
