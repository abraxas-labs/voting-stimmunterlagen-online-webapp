/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { StepBaseComponent } from '../step-base.component';
import { Step } from '../../../../models/step.model';
import { StepService } from '../../../../services/step.service';
import { ActivatedRoute, Router } from '@angular/router';
import { VotingExportService } from '../../../../services/voting-export.service';
import { ToastService } from '../../../../services/toast.service';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';

const votingStatisticsExportKey = 'voting_statistics';
const statisticsByReligionExportKey = 'statistics_by_religion';
const votingJournalExportKey = 'voting_journal';

@Component({
  selector: 'app-voting-journal',
  templateUrl: './voting-journal.component.html',
  styleUrls: ['./voting-journal.component.scss'],
})
export class VotingJournalComponent extends StepBaseComponent {
  public readonly defaultLastVoterUpdate = new Date();

  // using an uncached domain of influence (because the domain of influence on the step info is cached)
  public domainOfInfluence?: DomainOfInfluence;

  public readonly downloadItems: VotingJournalDownloadItem[] = [
    {
      key: votingJournalExportKey,
      title: 'VOTING_JOURNAL.VOTING_JOURNAL.TITLE',
      generating: false,
    },
    {
      key: votingStatisticsExportKey,
      title: 'VOTING_JOURNAL.VOTING_STATISTICS.TITLE',
      generating: false,
    },
    {
      key: statisticsByReligionExportKey,
      title: 'VOTING_JOURNAL.STATISTICS_BY_RELIGION.TITLE',
      generating: false,
    },
  ];

  constructor(
    private readonly toast: ToastService,
    private readonly domainOfInfluenceService: DomainOfInfluenceService,
    router: Router,
    route: ActivatedRoute,
    stepService: StepService,
    private readonly exportService: VotingExportService,
  ) {
    super(Step.STEP_VOTING_JOURNAL, router, route, stepService);
  }

  public async generateExport(item: VotingJournalDownloadItem): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    item.generating = true;

    try {
      await this.exportService.downloadExport(item.key, this.stepInfo.contest.id, this.stepInfo.domainOfInfluence.id);
      this.toast.success('VOTING_JOURNAL.EXPORT_SUCCESS');
    } finally {
      item.generating = false;
    }
  }

  protected async loadData(): Promise<void> {
    this.domainOfInfluence = await this.domainOfInfluenceService.get(this.stepInfo!.domainOfInfluence.id);
  }
}

interface VotingJournalDownloadItem {
  key: string;
  title: string;
  generating: boolean;
}
