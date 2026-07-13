/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ContestState } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Contest } from '../../../../models/contest.model';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { ContestService } from '../../../../services/contest.service';
import { DialogService } from '../../../../services/dialog.service';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { SelectDomainOfInfluenceDialogComponent } from '../../dialogs/select-domain-of-influence-dialog/select-domain-of-influence-dialog.component';
import { TableColumn, TableRow } from 'src/app/shared/components/contest-table/contest-table.component';
import { Sort } from '@abraxas/base-components';
import { defaultPageable, emptyPage, Page, Pageable } from '../../../../models/page.model';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
  styleUrls: ['./contest-list.component.scss'],
  standalone: false,
})
export class ContestListComponent implements OnInit {
  private readonly contestService = inject(ContestService);
  private readonly doiService = inject(DomainOfInfluenceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly dialog = inject(DialogService);

  public loading = true;
  public loadingDetail = false;

  public contests: Page<Contest> = emptyPage<Contest>();
  public pastContests: Page<Contest> = emptyPage<Contest>();
  public archivedContests: Page<Contest> = emptyPage<Contest>();
  public tableColums = TableColumn;
  public sorting: Sort[] = [{ id: this.tableColums.DATE, direction: 'asc' }];

  public async ngOnInit(): Promise<void> {
    try {
      this.contests = await this.contestService.list([ContestState.CONTEST_STATE_ACTIVE, ContestState.CONTEST_STATE_TESTING_PHASE]);
      await this.loadPastContests(defaultPageable);
      await this.loadArchivedContests(defaultPageable);
    } finally {
      this.loading = false;
    }
  }

  public async open(contest: TableRow): Promise<void> {
    if (this.loadingDetail) {
      return;
    }

    this.loadingDetail = true;
    try {
      const doi = await this.selectDomainOfInfluence(contest);
      if (!doi) {
        return;
      }

      await this.router.navigate([contest[this.tableColums.CONTEST_ID], doi.id], { relativeTo: this.route });
    } finally {
      this.loadingDetail = false;
    }
  }

  protected async loadPastContests(pageable: Pageable): Promise<void> {
    this.pastContests = await this.contestService.list(
      [ContestState.CONTEST_STATE_PAST_UNLOCKED, ContestState.CONTEST_STATE_PAST_LOCKED],
      pageable,
    );
  }

  protected async loadArchivedContests(pageable: Pageable): Promise<void> {
    this.archivedContests = await this.contestService.list([ContestState.CONTEST_STATE_ARCHIVED], pageable);
  }

  private async selectDomainOfInfluence(contest: TableRow): Promise<DomainOfInfluence | undefined> {
    const dois = await this.doiService.listManagedByCurrentTenant(contest[this.tableColums.CONTEST_ID]);

    if (dois.length > 1) {
      return await this.dialog.openForResult(SelectDomainOfInfluenceDialogComponent, dois);
    } else if (dois.length === 1) {
      return dois[0];
    }

    // this should never happen, as such contests are not listed at all.
    throw new Error('no access to this contest');
  }
}
