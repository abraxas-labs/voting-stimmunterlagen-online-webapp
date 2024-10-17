/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AutocompleteModule,
  BigStepperModule,
  CardModule,
  ExpansionPanelModule,
  FileInputModule,
  IconModule,
  LabelModule,
  MaskedModule,
  RadioButtonModule,
  TextareaModule,
} from '@abraxas/base-components';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { AttachmentTableComponent } from './components/attachment-table/attachment-table.component';
import { LayoutVotingCardsDomainOfInfluenceTableComponent } from './components/layout-voting-cards-domain-of-influence-table/layout-voting-cards-domain-of-influence-table.component';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import { PoliticalBusinessTableComponent } from './components/political-business-table/political-business-table.component';
import { VoterListTableComponent } from './components/voter-list-table/voter-list-table.component';
import { VotingCardPreviewComponent } from './components/voting-card-preview/voting-card-preview.component';
import { WizardSidebarHintComponent } from './components/wizard-sidebar/wizard-sidebar-hint/wizard-sidebar-hint.component';
import { WizardSidebarInfoComponent } from './components/wizard-sidebar/wizard-sidebar-info/wizard-sidebar-info.component';
import { WizardSidebarWarnComponent } from './components/wizard-sidebar/wizard-sidebar-warn/wizard-sidebar-warn.component';
import { WizardSidebarComponent } from './components/wizard-sidebar/wizard-sidebar.component';
import { WizardStepsComponent } from './components/wizard-steps/wizard-steps.component';
import { AttachmentCountDialogComponent } from './dialogs/attachment-count-dialog/attachment-count-dialog.component';
import { AttachmentEditDialogComponent } from './dialogs/attachment-edit-dialog/attachment-edit-dialog.component';
import { ManagerVotingCardLayoutDialogComponent } from './dialogs/manager-voting-card-layout-dialog/manager-voting-card-layout-dialog.component';
import { WizardOverviewPageComponent } from './pages/wizard-overview-page/wizard-overview-page.component';
import { AttachmentsComponent } from './steps/attachments/attachments.component';
import { ContestApprovalComponent } from './steps/contest-approval/contest-approval.component';
import { LayoutVotingCardsContestManagerComponent } from './steps/layout-voting-cards-contest-manager/layout-voting-cards-contest-manager.component';
import { LayoutVotingCardsDomainOfInfluencesComponent } from './steps/layout-voting-cards-domain-of-influences/layout-voting-cards-domain-of-influences.component';
import { LayoutVotingCardsPoliticalBusinessAttendeeComponent } from './steps/layout-voting-cards-political-business-attendee/layout-voting-cards-political-business-attendee.component';
import { PoliticalBusinessApprovalComponent } from './steps/political-business-approval/political-business-approval.component';
import { VoterListsComponent } from './steps/voter-lists/voter-lists.component';
import { WizardRoutingModule } from './wizard-routing.module';
import { RedirectFirstStepComponent } from './steps/redirect-first-step/redirect-first-step.component';
import { NoStepsComponent } from './steps/no-steps/no-steps.component';
import { GenerateVotingCardsComponent } from './steps/generate-voting-cards/generate-voting-cards.component';
import { DomainOfInfluenceVotingCardConfigurationComponent } from './components/domain-of-influence-voting-card-configuration/domain-of-influence-voting-card-configuration.component';
import { PrintJobOverviewComponent } from './steps/print-job-overview/print-job-overview.component';
import { GenerateManualVotingCardsComponent } from './steps/generate-manual-voting-cards/generate-manual-voting-cards.component';
import { ManualVotingCardVoterEditComponent } from './components/manual-voting-card-voter-edit/manual-voting-card-voter-edit.component';
import { ManualVotingCardGeneratorJobsTableComponent } from './components/manual-voting-card-generator-jobs-table/manual-voting-card-generator-jobs-table.component';
import { EVotingComponent } from './steps/e-voting/e-voting.component';
import { DomainOfInfluenceEVotingReadyComponent } from './components/domain-of-influence-e-voting-ready/domain-of-influence-e-voting-ready.component';
import { EVotingExportJobTableComponent } from './components/e-voting-export-job-table/e-voting-export-job-table.component';
import { VotingCardTemplateBricksDialogComponent } from './dialogs/voting-card-template-bricks-dialog/voting-card-template-bricks-dialog.component';
import { VotingCardTemplateBrickEditDialogComponent } from './dialogs/voting-card-template-brick-edit-dialog/voting-card-template-brick-edit-dialog.component';
import { AttachmentDomainOfInfluencesDialogComponent } from './dialogs/attachment-domain-of-influences-dialog/attachment-domain-of-influences-dialog.component';
import { ContestOverviewComponent } from './steps/contest-overview/contest-overview.component';
import { VoterListUploadEditDialogComponent } from './dialogs/voter-list-upload-edit-dialog/voter-list-upload-edit-dialog.component';
import { VoterListElectoralRegisterEditDialogComponent } from './dialogs/voter-list-electoral-register-edit-dialog/voter-list-electoral-register-edit-dialog.component';
import { VoterListImportEditFormComponent } from './components/voter-list-import-edit-form/voter-list-import-edit-form.component';
import { VoterListElectoralRegisterFilterVersionTableComponent } from './dialogs/voter-list-electoral-register-edit-dialog/voter-list-electoral-register-filter-version-table/voter-list-electoral-register-filter-version-table.component';
import { VoterListsUpdateStepComponent } from './components/voter-list-import-edit-form/voter-lists-update-step/voter-lists-update-step.component';
import { VoterDuplicateTableComponent } from './components/voter-duplicate-table/voter-duplicate-table.component';
import { VoterListImportSelectionDialogComponent } from './dialogs/voter-list-import-selection-dialog/voter-list-import-selection-dialog.component';
import { VotingJournalComponent } from './steps/voting-journal/voting-journal.component';
import { EVotingDomainOfInfluenceTableComponent } from './components/e-voting-domain-of-influence-table/e-voting-domain-of-influence-table.component';

@NgModule({
  declarations: [
    WizardOverviewPageComponent,
    PoliticalBusinessApprovalComponent,
    PoliticalBusinessTableComponent,
    WizardSidebarComponent,
    WizardStepsComponent,
    WizardSidebarInfoComponent,
    WizardSidebarHintComponent,
    ContestApprovalComponent,
    LayoutVotingCardsContestManagerComponent,
    LayoutVotingCardsPoliticalBusinessAttendeeComponent,
    LayoutVotingCardsDomainOfInfluencesComponent,
    AttachmentsComponent,
    AttachmentTableComponent,
    AttachmentEditDialogComponent,
    VoterListsComponent,
    VoterListTableComponent,
    VoterListUploadEditDialogComponent,
    WizardSidebarWarnComponent,
    AttachmentCountDialogComponent,
    PdfPreviewComponent,
    LayoutVotingCardsDomainOfInfluenceTableComponent,
    ManagerVotingCardLayoutDialogComponent,
    VotingCardTemplateBricksDialogComponent,
    VotingCardPreviewComponent,
    RedirectFirstStepComponent,
    NoStepsComponent,
    GenerateVotingCardsComponent,
    DomainOfInfluenceVotingCardConfigurationComponent,
    PrintJobOverviewComponent,
    GenerateManualVotingCardsComponent,
    ManualVotingCardVoterEditComponent,
    ManualVotingCardGeneratorJobsTableComponent,
    ContestOverviewComponent,
    EVotingComponent,
    DomainOfInfluenceEVotingReadyComponent,
    EVotingExportJobTableComponent,
    VotingCardTemplateBrickEditDialogComponent,
    AttachmentDomainOfInfluencesDialogComponent,
    VoterListElectoralRegisterEditDialogComponent,
    VoterListImportEditFormComponent,
    VoterListElectoralRegisterFilterVersionTableComponent,
    VoterListsUpdateStepComponent,
    VoterDuplicateTableComponent,
    VoterListImportSelectionDialogComponent,
    VotingJournalComponent,
    EVotingDomainOfInfluenceTableComponent,
  ],
  imports: [
    SharedModule,
    WizardRoutingModule,
    RadioButtonModule,
    FileInputModule,
    TextareaModule,
    MaskedModule,
    BigStepperModule,
    IconModule,
    LabelModule,
    CardModule,
    ExpansionPanelModule,
    AutocompleteModule,
  ],
})
export class WizardModule {}
