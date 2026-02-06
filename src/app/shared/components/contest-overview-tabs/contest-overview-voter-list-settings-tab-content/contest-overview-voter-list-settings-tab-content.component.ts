/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnInit, inject } from '@angular/core';
import { Contest } from '../../../../models/contest.model';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { DomainOfInfluences } from '@abraxas/voting-stimmunterlagen-proto';

@Component({
  selector: 'app-contest-overview-voter-list-settings-tab-content',
  templateUrl: './contest-overview-voter-list-settings-tab-content.component.html',
  styleUrls: ['./contest-overview-voter-list-settings-tab-content.component.scss'],
  standalone: false,
})
export class ContestOverviewVoterListSettingsTabContentComponent implements OnInit {
  private readonly doiService = inject(DomainOfInfluenceService);

  @Input()
  public contest!: Contest;

  public loading: boolean = true;
  public filteredDomainOfInfluences: DomainOfInfluence[] = [];

  private domainOfInfluences: DomainOfInfluence[] = [];

  public async ngOnInit(): Promise<void> {
    this.domainOfInfluences = await this.doiService.listChildren(this.contest.domainOfInfluence.id);

    if (this.contest.domainOfInfluence.responsibleForVotingCards) {
      this.domainOfInfluences = [...this.domainOfInfluences, this.contest.domainOfInfluence];
    }

    this.filteredDomainOfInfluences = this.domainOfInfluences;
    this.loading = false;
  }

  public filter(query: string): void {
    query = query.toUpperCase();
    this.filteredDomainOfInfluences = this.domainOfInfluences.filter(d => d.name.toUpperCase().startsWith(query));
  }
}
