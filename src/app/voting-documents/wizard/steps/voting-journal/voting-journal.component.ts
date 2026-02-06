/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { StepBaseComponent } from '../step-base.component';
import { Step } from '../../../../models/step.model';
import { VotingExportService } from '../../../../services/voting-export.service';
import { ToastService } from '../../../../services/toast.service';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { VoterList } from '../../../../models/voter-list.model';
import { VoterListService } from '../../../../services/voter-list.service';
import { TranslateService } from '@ngx-translate/core';

const votingStatisticsExportKey = 'voting_statistics';
const statisticsByReligionExportKey = 'statistics_by_religion';
const votingJournalExportKey = 'voting_journal';

@Component({
  selector: 'app-voting-journal',
  templateUrl: './voting-journal.component.html',
  styleUrls: ['./voting-journal.component.scss'],
  standalone: false,
})
export class VotingJournalComponent extends StepBaseComponent {
  private readonly toast = inject(ToastService);
  private readonly domainOfInfluenceService = inject(DomainOfInfluenceService);
  private readonly voterListService = inject(VoterListService);
  private readonly exportService = inject(VotingExportService);

  public readonly defaultGenerateVotingCardsTriggered = new Date();

  // using an uncached domain of influence (because the domain of influence on the step info is cached)
  public domainOfInfluence?: DomainOfInfluence;
  public voterLists: VoterList[] = [];

  public readonly aggregatedVoterList: VoterList = {
    id: undefined,
  } as any;

  public downloadItemsByVoterListId: Record<string, VotingJournalDownloadItem[]> = {};

  constructor() {
    super(Step.STEP_VOTING_JOURNAL);

    const i18n = inject(TranslateService);
    this.aggregatedVoterList.name = i18n.instant('VOTING_JOURNAL.AGGREGATED_VOTER_LIST_NAME');
  }

  public async generateExport(item: VotingJournalDownloadItem, voterListId?: string): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    item.generating = true;

    try {
      await this.exportService.downloadExport(item.key, this.stepInfo.contest.id, this.stepInfo.domainOfInfluence.id, voterListId);
      this.toast.success('VOTING_JOURNAL.EXPORT_SUCCESS');
    } finally {
      item.generating = false;
    }
  }

  protected async loadData(): Promise<void> {
    this.domainOfInfluence = await this.domainOfInfluenceService.get(this.stepInfo!.domainOfInfluence.id);
    const voterLists = await this.voterListService.list(this.stepInfo!.domainOfInfluence.id);

    this.voterLists = [this.aggregatedVoterList, ...voterLists.voterLists.filter(vl => vl.countOfVotingCards > 0)];

    this.downloadItemsByVoterListId = {};
    for (const voterList of this.voterLists) {
      this.downloadItemsByVoterListId[voterList.id] = [
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
    }
  }
}

interface VotingJournalDownloadItem {
  key: string;
  title: string;
  generating: boolean;
}
