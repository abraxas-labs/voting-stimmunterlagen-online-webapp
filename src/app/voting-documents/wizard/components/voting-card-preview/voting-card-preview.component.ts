/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-voting-card-preview',
  templateUrl: './voting-card-preview.component.html',
  styleUrls: ['./voting-card-preview.component.scss'],
})
export class VotingCardPreviewComponent {
  @Input()
  public votingCardTypes: VotingCardType[] = [];

  @Input()
  public previewLoading = false;

  @Input()
  public previewData?: Uint8Array;

  @Input()
  public set selectedVotingCardType(v: VotingCardType) {
    this.selectedVotingCardTypeValue = v;
    this.selectedIndex = this.votingCardTypes.indexOf(v);
  }

  @Output()
  public selectedVotingCardTypeChange: EventEmitter<VotingCardType> = new EventEmitter<VotingCardType>();

  public selectedIndex = 0;

  private selectedVotingCardTypeValue?: VotingCardType;

  public select(idx: number): void {
    if (idx === this.selectedIndex) {
      return;
    }

    this.selectedIndex = idx;
    this.selectedVotingCardTypeValue = this.votingCardTypes[idx];
    this.selectedVotingCardTypeChange.emit(this.selectedVotingCardTypeValue);
  }
}
