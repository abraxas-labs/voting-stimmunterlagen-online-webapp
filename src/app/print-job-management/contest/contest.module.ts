/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContestRoutingModule } from './contest-routing.module';
import { ContestDetailComponent } from './pages/contest-detail/contest-detail.component';
import { ContestListPageComponent } from './pages/contest-list-page/contest-list-page.component';

@NgModule({
  declarations: [ContestListPageComponent, ContestDetailComponent],
  imports: [SharedModule, ContestRoutingModule],
})
export class ContestModule {}
