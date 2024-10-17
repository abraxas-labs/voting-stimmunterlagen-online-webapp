/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Contest } from '../../../models/contest.model';

@Component({
  selector: 'app-contest-table',
  templateUrl: './contest-table.component.html',
  styleUrls: ['./contest-table.component.scss'],
})
export class ContestTableComponent implements OnChanges {
  private readonly defaultColumns = ['date', 'printingCenterSignupDeadline', 'generateVotingCardsDeadline', 'attachmentDeliveryDeadline'];
  public readonly domainOfInfluenceColumn = 'domainOfInfluenceName';
  public readonly authorityColumn = 'authority';

  public columns = [...this.defaultColumns];

  @Input()
  public contests: Contest[] = [];

  @Output()
  public readonly openDetail: EventEmitter<Contest> = new EventEmitter<Contest>();

  @Input()
  public displayDomainOfInfluenceDetails = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes.displayDomainOfInfluenceDetails) {
      return;
    }
    this.onDisplayDomainOfInfluenceDetailsChange();
  }

  private onDisplayDomainOfInfluenceDetailsChange(): void {
    this.columns = [...this.defaultColumns];

    if (this.displayDomainOfInfluenceDetails) {
      this.columns.splice(1, 0, this.authorityColumn);
      this.columns.splice(2, 0, this.domainOfInfluenceColumn);
    }
  }
}
