/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnInit } from '@angular/core';
import { CheckableItems } from '../../../../models/checkable-item.model';
import { PoliticalBusiness } from '../../../../models/political-business.model';
import { groupBy } from '../../../../services/utils/array.utils';
import { VoterList } from '../../../../models/voter-list.model';
import { VotingCardType } from '../../../../models/voting-card-type.model';

@Component({
  selector: 'app-voter-list-edit-form',
  standalone: false,
  templateUrl: './voter-list-edit-form.component.html',
  styleUrls: ['./voter-list-edit-form.component.scss'],
})
export class VoterListEditFormComponent implements OnInit {
  public readonly votingCardTypes: typeof VotingCardType = VotingCardType;

  public doiNameCheckablePoliticalBusinessesPairs!: Record<string, CheckableItems<PoliticalBusiness>>;

  @Input()
  public voterList!: VoterList;

  @Input()
  public electoralRegisterMultipleEnabled = false;

  @Input()
  public autoSendVotingCardsToDomainOfInfluenceReturnAddressSplit: boolean = false;

  public ngOnInit(): void {
    this.doiNameCheckablePoliticalBusinessesPairs = CheckableItems.buildFromRecords(
      groupBy(this.voterList.checkablePoliticalBusinesses.items, x => x.item.domainOfInfluence.name),
    );
  }

  public updateSendVotingCardsToDomainOfInfluenceReturnAddress(v: boolean): void {
    if (this.voterList.sendVotingCardsToDomainOfInfluenceReturnAddress === v) {
      return;
    }

    this.voterList.sendVotingCardsToDomainOfInfluenceReturnAddress = v;
    this.voterList.countOfVotingCardsForDomainOfInfluenceReturnAddress = v ? this.voterList.countOfVotingCards : 0;
  }
}
