/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbItem } from '../../models/breadcrumb-item.model';
import { Step } from '../../models/step.model';
import { PrintJobResolver } from '../../services/resolver/print-job.resolver';
import { StepsResolver } from '../../services/resolver/steps-resolver.service';
import { NotFoundComponent } from '../../shared/components/not-found/not-found.component';
import { PrintJobDetailComponent } from '../../shared/components/print-job-detail/print-job-detail.component';
import { WizardOverviewPageComponent } from './pages/wizard-overview-page/wizard-overview-page.component';
import { AttachmentsComponent } from './steps/attachments/attachments.component';
import { ContestApprovalComponent } from './steps/contest-approval/contest-approval.component';
import { EVotingComponent } from './steps/e-voting/e-voting.component';
import { GenerateManualVotingCardsComponent } from './steps/generate-manual-voting-cards/generate-manual-voting-cards.component';
import { GenerateVotingCardsComponent } from './steps/generate-voting-cards/generate-voting-cards.component';
import { LayoutVotingCardsContestManagerComponent } from './steps/layout-voting-cards-contest-manager/layout-voting-cards-contest-manager.component';
import { LayoutVotingCardsDomainOfInfluencesComponent } from './steps/layout-voting-cards-domain-of-influences/layout-voting-cards-domain-of-influences.component';
import { LayoutVotingCardsPoliticalBusinessAttendeeComponent } from './steps/layout-voting-cards-political-business-attendee/layout-voting-cards-political-business-attendee.component';
import { NoStepsComponent } from './steps/no-steps/no-steps.component';
import { PoliticalBusinessApprovalComponent } from './steps/political-business-approval/political-business-approval.component';
import { PrintJobOverviewComponent } from './steps/print-job-overview/print-job-overview.component';
import { RedirectFirstStepComponent } from './steps/redirect-first-step/redirect-first-step.component';
import { VoterListsComponent } from './steps/voter-lists/voter-lists.component';
import { ContestOverviewComponent } from './steps/contest-overview/contest-overview.component';
import { VotingJournalComponent } from './steps/voting-journal/voting-journal.component';

const routes: Routes = [
  {
    path: '',
    component: WizardOverviewPageComponent,
    resolve: {
      steps: StepsResolver,
    },
    data: {
      breadcrumbs: [
        {
          label: 'BREADCRUMBS.WIZARD',
        },
      ] as BreadcrumbItem[],
    },
    children: [
      {
        path: '' + Step.STEP_POLITICAL_BUSINESSES_APPROVAL,
        component: PoliticalBusinessApprovalComponent,
        data: {
          step: Step.STEP_POLITICAL_BUSINESSES_APPROVAL,
        },
      },
      {
        path: '' + Step.STEP_LAYOUT_VOTING_CARDS_CONTEST_MANAGER,
        component: LayoutVotingCardsContestManagerComponent,
        data: {
          step: Step.STEP_LAYOUT_VOTING_CARDS_CONTEST_MANAGER,
        },
      },
      {
        path: '' + Step.STEP_LAYOUT_VOTING_CARDS_DOMAIN_OF_INFLUENCES,
        component: LayoutVotingCardsDomainOfInfluencesComponent,
        data: {
          step: Step.STEP_LAYOUT_VOTING_CARDS_DOMAIN_OF_INFLUENCES,
        },
      },
      {
        path: '' + Step.STEP_LAYOUT_VOTING_CARDS_POLITICAL_BUSINESS_ATTENDEE,
        component: LayoutVotingCardsPoliticalBusinessAttendeeComponent,
        data: {
          step: Step.STEP_LAYOUT_VOTING_CARDS_POLITICAL_BUSINESS_ATTENDEE,
        },
      },
      {
        path: '' + Step.STEP_CONTEST_APPROVAL,
        component: ContestApprovalComponent,
        data: {
          step: Step.STEP_CONTEST_APPROVAL,
        },
      },
      {
        path: '' + Step.STEP_ATTACHMENTS,
        component: AttachmentsComponent,
        data: {
          step: Step.STEP_ATTACHMENTS,
        },
      },
      {
        path: '' + Step.STEP_VOTER_LISTS,
        component: VoterListsComponent,
        data: {
          step: Step.STEP_VOTER_LISTS,
        },
      },
      {
        path: '' + Step.STEP_GENERATE_VOTING_CARDS,
        component: GenerateVotingCardsComponent,
        data: {
          step: Step.STEP_GENERATE_VOTING_CARDS,
        },
      },
      {
        path: '' + Step.STEP_E_VOTING,
        component: EVotingComponent,
        data: {
          step: Step.STEP_E_VOTING,
        },
      },
      {
        path: '' + Step.STEP_PRINT_JOB_OVERVIEW,
        component: PrintJobOverviewComponent,
        data: {
          step: Step.STEP_PRINT_JOB_OVERVIEW,
        },
      },
      {
        path: '' + Step.STEP_GENERATE_MANUAL_VOTING_CARDS,
        component: GenerateManualVotingCardsComponent,
        data: {
          step: Step.STEP_GENERATE_MANUAL_VOTING_CARDS,
        },
      },
      {
        path: '' + Step.STEP_CONTEST_OVERVIEW,
        component: ContestOverviewComponent,
        data: {
          step: Step.STEP_CONTEST_OVERVIEW,
        },
      },
      {
        path: '' + Step.STEP_VOTING_JOURNAL,
        component: VotingJournalComponent,
        data: {
          step: Step.STEP_VOTING_JOURNAL,
        },
      },
      {
        path: 'no-steps',
        component: NoStepsComponent,
      },
      {
        path: '',
        pathMatch: 'full',
        component: RedirectFirstStepComponent, // use component instead of redirectTo to access resolved data.
      },
    ],
  },
  {
    path: 'print-job/:domainOfInfluenceId',
    component: PrintJobDetailComponent,
    resolve: {
      printJob: PrintJobResolver,
    },
    data: {
      editable: false,
      breadcrumbs: [
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
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class WizardRoutingModule {}
