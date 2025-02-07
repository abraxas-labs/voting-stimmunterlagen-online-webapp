/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { Contest } from '../../../models/contest.model';
import { EnumItemDescription, EnumUtil } from '../../../services/enum.util';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contest-overview-tabs',
  templateUrl: './contest-overview-tabs.component.html',
  styleUrls: ['./contest-overview-tabs.component.scss'],
})
export class ContestOverviewTabsComponent implements OnChanges, OnDestroy {
  private routeQueryParamsSubscription: Subscription;

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

  constructor(enumUtil: EnumUtil, route: ActivatedRoute) {
    this.defaultTabItems = enumUtil.getArrayWithDescriptionsWithUnspecified(ContestOverviewTab, 'PRINT_JOB_MANAGEMENT.CONTEST.TABS.');

    this.routeQueryParamsSubscription = route.queryParams.subscribe(p => {
      if (!p.contestOverviewTab) {
        return;
      }

      const contestOverviewTabIndex = this.defaultTabItems.map(t => t.value).indexOf(+p.contestOverviewTab);
      if (contestOverviewTabIndex < 0) {
        return;
      }

      this.selectedTabIndex = contestOverviewTabIndex;
    });
  }

  public ngOnDestroy(): void {
    this.routeQueryParamsSubscription.unsubscribe();
  }

  public ngOnChanges(): void {
    if (this.forPrintJobManagement) {
      this.tabItems = this.defaultTabItems.filter(i => i.value !== ContestOverviewTab.VOTER_LIST_SETTINGS);
      return;
    }

    this.tabItems = this.defaultTabItems.filter(i => i.value !== ContestOverviewTab.INVOICES);
    if (this.contest?.domainOfInfluence.electoralRegistrationEnabled === false || environment.isElectoralRegistrationEnabled === false) {
      this.tabItems = this.tabItems.filter(i => i.value !== ContestOverviewTab.VOTER_LIST_SETTINGS);
    }
  }
}

export enum ContestOverviewTab {
  ATTACHMENTS,
  PRINT_JOBS,
  INVOICES,
  VOTER_LIST_SETTINGS,
}
