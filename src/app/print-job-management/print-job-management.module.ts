/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { PrintJobManagementRoutingModule } from './print-job-management-routing.module';

@NgModule({
  declarations: [],
  imports: [PrintJobManagementRoutingModule, SharedModule],
})
export class PrintJobManagementModule {}
