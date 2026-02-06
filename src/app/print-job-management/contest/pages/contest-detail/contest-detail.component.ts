/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnDestroy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contest } from '../../../../models/contest.model';

@Component({
  selector: 'app-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.scss'],
  standalone: false,
})
export class ContestDetailComponent implements OnDestroy {
  public contest?: Contest;

  private readonly routeSubscription: Subscription;

  constructor() {
    const route = inject(ActivatedRoute);

    this.routeSubscription = route.data.subscribe(({ contest }) => {
      this.contest = contest;
    });
  }

  public ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }
}
