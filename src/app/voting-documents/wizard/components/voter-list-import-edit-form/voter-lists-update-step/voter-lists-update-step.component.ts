/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnChanges } from '@angular/core';
import { VoterListSource, VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { VoterList } from '../../../../../models/voter-list.model';

@Component({
  selector: 'app-voter-lists-update-step',
  templateUrl: './voter-lists-update-step.component.html',
  styleUrls: ['./voter-lists-update-step.component.scss'],
  standalone: false,
})
export class VoterListsUpdateStepComponent implements OnChanges {
  @Input()
  public voterLists: VoterList[] = [];

  @Input()
  public voterListSource!: VoterListSource;

  @Input()
  public autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit = false;

  @Input()
  public electoralRegisterMultipleEnabled = false;

  public ngOnChanges(): void {
    if (!this.voterLists) {
      return;
    }

    for (const voterList of this.voterLists) {
      if (this.autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit) {
        voterList.sendVotingCardsToDomainOfInfluenceReturnAddress = undefined;
      }
    }
  }
}
