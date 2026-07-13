/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-voter-list-send-voting-cards-to-doi-return-address-chip',
  templateUrl: './voter-list-send-voting-cards-to-doi-return-address-chip.component.html',
  styleUrl: './voter-list-send-voting-cards-to-doi-return-address-chip.component.scss',
  standalone: false,
})
export class VoterListSendVotingCardsToDoiReturnAddressChipComponent {
  @Input()
  public sendVotingCardsToDomainOfInfluenceReturnAddress?: boolean;

  @Input()
  public autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit?: boolean;
}
