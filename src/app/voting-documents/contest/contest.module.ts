/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ContestRoutingModule } from './contest-routing.module';
import { SelectDomainOfInfluenceDialogComponent } from './dialogs/select-domain-of-influence-dialog/select-domain-of-influence-dialog.component';
import { ContestListComponent } from './pages/contest-list/contest-list.component';

@NgModule({
  declarations: [ContestListComponent, SelectDomainOfInfluenceDialogComponent],
  imports: [SharedModule, ContestRoutingModule],
})
export class ContestModule {}
