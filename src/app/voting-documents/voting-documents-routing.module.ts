/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { RoleGuard } from '@abraxas/base-components';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Roles } from '../models/roles.model';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contests',
  },
  {
    path: 'contests',
    loadChildren: () => import('./contest/contest.module').then(x => x.ContestModule),
    canActivate: [RoleGuard],
    data: {
      roles: [Roles.ElectionAdmin],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotingDocumentsRoutingModule {}
