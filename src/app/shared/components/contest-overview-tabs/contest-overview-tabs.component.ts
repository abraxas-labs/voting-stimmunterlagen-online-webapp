/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnChanges } from '@angular/core';
import { Contest } from '../../../models/contest.model';
import { EnumItemDescription, EnumUtil } from '../../../services/enum.util';

@Component({
  selector: 'app-contest-overview-tabs',
  templateUrl: './contest-overview-tabs.component.html',
  styleUrls: ['./contest-overview-tabs.component.scss'],
})
export class ContestOverviewTabsComponent implements OnChanges {
  public readonly contestDetailTabs: typeof ContestOverviewTab = ContestOverviewTab;
  public readonly defaultTabItems: EnumItemDescription<ContestOverviewTab>[] = [];

  public tabItems: EnumItemDescription<ContestOverviewTab>[] = [];

  public selectedTabIndex = 0;

  public get selectedTab(): ContestOverviewTab {
    return this.tabItems[this.selectedTabIndex].value;
  }

  @Input()
  public forPrintJobManagement = false;

  @Input()
  public contest?: Contest;

  constructor(enumUtil: EnumUtil) {
    this.defaultTabItems = enumUtil.getArrayWithDescriptionsWithUnspecified(ContestOverviewTab, 'PRINT_JOB_MANAGEMENT.CONTEST.TABS.');
  }

  public ngOnChanges(): void {
    if (this.forPrintJobManagement) {
      this.tabItems = this.defaultTabItems.filter(i => i.value !== ContestOverviewTab.VOTER_LIST_SETTINGS);
      return;
    }

    this.tabItems = this.defaultTabItems.filter(i => i.value !== ContestOverviewTab.INVOICES);
    if (this.contest?.domainOfInfluence.electoralRegistrationEnabled === false) {
      this.tabItems = this.tabItems.filter(i => i.value !== ContestOverviewTab.VOTER_LIST_SETTINGS);
    }
  }
}

enum ContestOverviewTab {
  ATTACHMENTS,
  PRINT_JOBS,
  INVOICES,
  VOTER_LIST_SETTINGS,
}
