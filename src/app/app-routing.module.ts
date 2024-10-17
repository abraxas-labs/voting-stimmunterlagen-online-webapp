/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectByRolePageComponent } from './app/pages/redirect-by-role-page/redirect-by-role-page.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { AuthThemeGuard, ThemeService } from '@abraxas/voting-lib';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: ThemeService.NoTheme,
  },
  {
    path: ':theme',
    canActivate: [AuthThemeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: RedirectByRolePageComponent,
      },
      {
        path: 'voting-documents',
        loadChildren: () => import('./voting-documents/voting-documents.module').then(x => x.VotingDocumentsModule),
      },
      {
        path: 'print-job-management',
        loadChildren: () => import('./print-job-management/print-job-management.module').then(x => x.PrintJobManagementModule),
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { paramsInheritanceStrategy: 'always' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
