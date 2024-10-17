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
})
export class VoterListsUpdateStepComponent implements OnChanges {
  public readonly voterListSources: typeof VoterListSource = VoterListSource;
  public readonly votingCardTypes: typeof VotingCardType = VotingCardType;

  @Input()
  public voterLists: VoterList[] = [];

  @Input()
  public voterListSource!: VoterListSource;

  @Input()
  public autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit = false;

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

  public updateSendVotingCardsToDomainOfInfluenceReturnAddress(voterList: VoterList, v: boolean): void {
    if (voterList.sendVotingCardsToDomainOfInfluenceReturnAddress === v) {
      return;
    }

    voterList.sendVotingCardsToDomainOfInfluenceReturnAddress = v;
    voterList.countOfSendVotingCardsToDomainOfInfluenceReturnAddress = v ? voterList.numberOfVoters : 0;
  }
}
