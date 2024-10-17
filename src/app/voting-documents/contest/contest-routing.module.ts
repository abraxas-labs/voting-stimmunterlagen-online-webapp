/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbItem } from '../../models/breadcrumb-item.model';
import { ContestResolver } from '../../services/resolver/contest.resolver';
import { DomainOfInfluenceResolver } from '../../services/resolver/domain-of-influence.resolver';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';
import { ContestListComponent } from './pages/contest-list/contest-list.component';

const routes: Routes = [
  {
    path: '',
    component: ContestListComponent,
  },
  {
    path: ':contestId/:domainOfInfluenceId',
    loadChildren: () => import('../wizard/wizard.module').then(x => x.WizardModule),
    runGuardsAndResolvers: 'always',
    resolve: {
      contest: ContestResolver,
      domainOfInfluence: DomainOfInfluenceResolver,
    },
    data: {
      breadcrumbs: [
        {
          link: '/',
          label: 'BREADCRUMBS.CONTEST_OVERVIEW',
        },
      ] as BreadcrumbItem[],
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ContestRoutingModule {}
