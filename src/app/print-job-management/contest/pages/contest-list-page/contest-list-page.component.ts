/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest, ContestState } from '../../../../models/contest.model';
import { ContestService } from '../../../../services/contest.service';
import { Sort } from '@abraxas/base-components';
import { TableColumn, TableRow } from 'src/app/shared/components/contest-table/contest-table.component';

@Component({
  selector: 'app-contest-list-page',
  templateUrl: './contest-list-page.component.html',
  styleUrls: ['./contest-list-page.component.scss'],
  standalone: false,
})
export class ContestListPageComponent implements OnInit {
  private readonly contestService = inject(ContestService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public loading = true;
  public contests: Contest[] = [];
  public pastContests: Contest[] = [];
  public tableColums = TableColumn;
  public sorting: Sort[] = [
    { id: this.tableColums.PRINT_JOB_STATE, direction: 'asc' },
    { id: this.tableColums.POST_DEADLINE, direction: 'asc' },
  ];

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

  public async open(contest: TableRow): Promise<void> {
    await this.router.navigate([contest[this.tableColums.CONTEST_ID]], { relativeTo: this.route });
  }
}
