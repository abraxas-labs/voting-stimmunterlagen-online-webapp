/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbItem } from '../../models/breadcrumb-item.model';
import { ContestResolver } from '../../services/resolver/contest.resolver';
import { PrintJobResolver } from '../../services/resolver/print-job.resolver';
import { ContestDetailComponent } from './pages/contest-detail/contest-detail.component';
import { ContestListPageComponent } from './pages/contest-list-page/contest-list-page.component';
import { PrintJobDetailComponent } from '../../shared/components/print-job-detail/print-job-detail.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ContestListPageComponent,
  },
  {
    path: ':contestId',
    component: ContestDetailComponent,
    data: {
      breadcrumbs: [
        {
          link: '/',
          label: 'BREADCRUMBS.CONTEST_OVERVIEW',
        },
        {
          label: 'BREADCRUMBS.CONTEST_DETAIL',
        },
      ] as BreadcrumbItem[],
    },
    resolve: {
      contest: ContestResolver,
    },
  },
  {
    path: ':contestId/print-job/:domainOfInfluenceId',
    component: PrintJobDetailComponent,
    resolve: {
      contest: ContestResolver,
      printJob: PrintJobResolver,
    },
    data: {
      editable: true,
      breadcrumbs: [
        {
          link: '/',
          label: 'BREADCRUMBS.CONTEST_OVERVIEW',
        },
        {
          link: './../../',
          label: 'BREADCRUMBS.CONTEST_DETAIL',
          relativeToCurrentRoute: true,
        },
        {
          label: 'BREADCRUMBS.PRINT_JOB_DETAIL',
        },
      ] as BreadcrumbItem[],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContestRoutingModule {}
