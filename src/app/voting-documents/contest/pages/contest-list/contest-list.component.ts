/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ContestState } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest } from '../../../../models/contest.model';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { ContestService } from '../../../../services/contest.service';
import { DialogService } from '../../../../services/dialog.service';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { SelectDomainOfInfluenceDialogComponent } from '../../dialogs/select-domain-of-influence-dialog/select-domain-of-influence-dialog.component';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.scss'],
})
export class ContestListComponent implements OnInit {
  public loading = true;
  public loadingDetail = false;

  public contests: Contest[] = [];
  public pastContests: Contest[] = [];
  public archivedContests: Contest[] = [];

  constructor(
    private readonly contestService: ContestService,
    private readonly doiService: DomainOfInfluenceService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly dialog: DialogService,
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      [this.contests, this.pastContests, this.archivedContests] = await Promise.all([
        this.contestService.list(ContestState.CONTEST_STATE_ACTIVE, ContestState.CONTEST_STATE_TESTING_PHASE),
        this.contestService.list(ContestState.CONTEST_STATE_PAST_UNLOCKED, ContestState.CONTEST_STATE_PAST_LOCKED),
        this.contestService.list(ContestState.CONTEST_STATE_ARCHIVED),
      ]);
    } finally {
      this.loading = false;
    }
  }

  public async open(contest: Contest): Promise<void> {
    if (this.loadingDetail) {
      return;
    }

    this.loadingDetail = true;
    try {
      const doi = await this.selectDomainOfInfluence(contest);
      if (!doi) {
        return;
      }

      await this.router.navigate([contest.id, doi.id], { relativeTo: this.route });
    } finally {
      this.loadingDetail = false;
    }
  }

  private async selectDomainOfInfluence(contest: Contest): Promise<DomainOfInfluence | undefined> {
    const dois = await this.doiService.listManagedByCurrentTenant(contest.id);

    if (dois.length > 1) {
      return await this.dialog.openForResult(SelectDomainOfInfluenceDialogComponent, dois);
    } else if (dois.length === 1) {
      return dois[0];
    }

    // this should never happen, as such contests are not listed at all.
    throw new Error('no access to this contest');
  }
}
