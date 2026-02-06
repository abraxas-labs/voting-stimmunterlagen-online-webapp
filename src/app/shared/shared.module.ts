/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ButtonModule,
  CheckboxModule,
  DateModule,
  DropdownModule,
  NumberModule,
  RadioButtonModule,
  SearchModule,
  SegmentedControlGroupModule,
  SpinnerModule,
  StatusLabelModule,
  TableModule,
  TabsModule,
  TextareaModule,
  TextModule,
  TruncateWithTooltipModule,
} from '@abraxas/base-components';
import { VotingStimmunterlagenProtoModule } from '@abraxas/voting-stimmunterlagen-proto';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GrpcCoreModule, GrpcLoggerModule } from '@ngx-grpc/core';
import { GrpcWebClientModule } from '@ngx-grpc/grpc-web-client';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonBarComponent } from './components/button-bar/button-bar.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { GridTableItemEntryComponent } from './components/grid-table/grid-table-item-entry/grid-table-item-entry.component';
import { GridTableItemComponent } from './components/grid-table/grid-table-item/grid-table-item.component';
import { GridTableComponent } from './components/grid-table/grid-table.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { PrintJobDetailComponent } from './components/print-job-detail/print-job-detail.component';
import { PrintJobInfoComponent } from './components/print-job-info/print-job-info.component';
import { ExportJobStateComponent } from './components/export-job-state/export-job-state.component';
import { VotingCardPrintFileExportJobTableComponent } from './components/voting-card-print-file-export-job-table/voting-card-print-file-export-job-table.component';
import { PrintJobResetStateDialogComponent } from './dialogs/print-job-reset-state-dialog/print-job-reset-state-dialog.component';
import { PrintJobSetNextStateDialogComponent } from './dialogs/print-job-set-next-state-dialog/print-job-set-next-state-dialog.component';
import { EveryPipe } from './pipes/every.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { VotingCardGeneratorJobStateComponent } from './components/voting-card-generator-job-state/voting-card-generator-job-state.component';
import { AttachmentStateComponent } from './components/attachment-state/attachment-state.component';
import { ContestTableComponent } from './components/contest-table/contest-table.component';
import { SetValueLabelComponent } from './components/set-value-label/set-value-label.component';
import { AttachmentInfoTableComponent } from './components/attachment-info-table/attachment-info-table.component';
import { VotingCardGeneratorJobTableComponent } from './components/voting-card-generator-job-table/voting-card-generator-job-table.component';
import { AttachmentFilterComponent } from './components/attachment-filter/attachment-filter.component';
import { PrintJobFilterComponent } from './components/print-job-filter/print-job-filter.component';
import { PrintJobStateComponent } from './components/print-job-state/print-job-state.component';
import { AttachmentStateDialogComponent } from './components/attachment-state-dialog/attachment-state-dialog.component';
import { AttachmentStationDialogComponent } from './components/attachment-station-dialog/attachment-station-dialog.component';
import { ContestPrintingCenterSignUpDeadlineDialogComponent } from './components/contest-printing-center-sign-up-deadline-dialog/contest-printing-center-sign-up-deadline-dialog.component';
import { ContestOverviewTabsComponent } from './components/contest-overview-tabs/contest-overview-tabs.component';
import { ContestOverviewAttachmentTabContentComponent } from './components/contest-overview-tabs/contest-overview-attachment-tab-content/contest-overview-attachment-tab-content.component';
import { ContestOverviewAttachmentTableComponent } from './components/contest-overview-tabs/contest-overview-attachment-table/contest-overview-attachment-table.component';
import { ContestOverviewPrintJobTabContentComponent } from './components/contest-overview-tabs/contest-overview-print-job-tab-content/contest-overview-print-job-tab-content.component';
import { ContestOverviewPrintJobTableComponent } from './components/contest-overview-tabs/contest-overview-print-job-table/contest-overview-print-job-table.component';
import { ContestOverviewVoterListSettingsTabContentComponent } from './components/contest-overview-tabs/contest-overview-voter-list-settings-tab-content/contest-overview-voter-list-settings-tab-content.component';
import { ContestOverviewVoterListSettingsTableComponent } from './components/contest-overview-tabs/contest-overview-voter-list-settings-table/contest-overview-voter-list-settings-table.component';
import { ContestOverviewInvoiceTabContentComponent } from './components/contest-overview-tabs/contest-overview-invoice-tab-content/contest-overview-invoice-tab-content.component';
import { ContestOverviewAdditionalInvoicePositionTableComponent } from './components/contest-overview-tabs/contest-overview-additional-invoice-position-table/contest-overview-additional-invoice-position-table.component';
import { AdditionalInvoicePositionEditDialogComponent } from './components/additional-invoice-position-edit-dialog/additional-invoice-position-edit-dialog.component';
import { VotingCardLayoutDataConfigurationEditComponent } from './components/voting-card-layout-data-configuration-edit/voting-card-layout-data-configuration-edit.component';
import { AttachmentEditDialogComponent } from './dialogs/attachment-edit-dialog/attachment-edit-dialog.component';

const modules = [
  CommonModule,
  RouterModule,
  FormsModule,
  VotingStimmunterlagenProtoModule,
  GrpcCoreModule,
  GrpcLoggerModule,
  GrpcWebClientModule,
  TranslateModule,
  TableModule,
  DropdownModule,
  DateModule,
  SpinnerModule,
  ButtonModule,
  CheckboxModule,
  TextModule,
  NumberModule,
  StatusLabelModule,
  TabsModule,
  SearchModule,
  SegmentedControlGroupModule,
  TextareaModule,
  TruncateWithTooltipModule,
  RadioButtonModule,
];

const components = [
  NotFoundComponent,
  ButtonBarComponent,
  ConfirmDialogComponent,
  DialogComponent,
  GridTableComponent,
  GridTableItemComponent,
  GridTableItemEntryComponent,
  VotingCardGeneratorJobStateComponent,
  AttachmentStateComponent,
  ContestTableComponent,
  SetValueLabelComponent,
  AttachmentInfoTableComponent,
  VotingCardGeneratorJobTableComponent,
  ContestOverviewTabsComponent,
  ContestOverviewAttachmentTabContentComponent,
  ContestOverviewAttachmentTableComponent,
  ContestOverviewPrintJobTabContentComponent,
  ContestOverviewPrintJobTableComponent,
  AttachmentFilterComponent,
  PrintJobFilterComponent,
  PrintJobStateComponent,
  AttachmentEditDialogComponent,
  AttachmentStateDialogComponent,
  AttachmentStationDialogComponent,
  ContestPrintingCenterSignUpDeadlineDialogComponent,
  PrintJobDetailComponent,
  PrintJobInfoComponent,
  VotingCardPrintFileExportJobTableComponent,
  ExportJobStateComponent,
  PrintJobResetStateDialogComponent,
  PrintJobSetNextStateDialogComponent,
  ContestOverviewVoterListSettingsTabContentComponent,
  ContestOverviewVoterListSettingsTableComponent,
  ContestOverviewInvoiceTabContentComponent,
  ContestOverviewAdditionalInvoicePositionTableComponent,
  AdditionalInvoicePositionEditDialogComponent,
  VotingCardLayoutDataConfigurationEditComponent,
];

const pipes = [EveryPipe, SafeUrlPipe];

@NgModule({
  imports: [...modules],
  exports: [...modules, ...components, ...pipes],
  declarations: [...components, ...pipes],
})
export class SharedModule {}
