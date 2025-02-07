/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest, ContestState } from '../../../../models/contest.model';
import { ContestService } from '../../../../services/contest.service';

@Component({
  selector: 'app-contest-list-page',
  templateUrl: './contest-list-page.component.html',
  styleUrls: ['./contest-list-page.component.scss'],
})
export class ContestListPageComponent implements OnInit {
  public loading = true;

  public contests: Contest[] = [];
  public pastContests: Contest[] = [];

  constructor(
    private readonly contestService: ContestService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  public async ngOnInit(): Promise<void> {
    try {
      [this.contests, this.pastContests] = await Promise.all([
        this.contestService.list(ContestState.CONTEST_STATE_ACTIVE, ContestState.CONTEST_STATE_TESTING_PHASE),
        this.contestService.list(ContestState.CONTEST_STATE_PAST_UNLOCKED, ContestState.CONTEST_STATE_PAST_LOCKED),
      ]);
    } finally {
      this.loading = false;
    }
  }

  public async open(contest: Contest): Promise<void> {
    await this.router.navigate([contest.id], { relativeTo: this.route });
  }
}
