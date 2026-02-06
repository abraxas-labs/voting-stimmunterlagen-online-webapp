/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { VoterList } from '../../../../models/voter-list.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { VoterListService } from '../../../../services/voter-list.service';
import { ToastService } from '../../../../services/toast.service';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';

@Component({
  selector: 'app-voter-list-empty-voting-cards-edit-dialog',
  templateUrl: './voter-list-empty-voting-cards-edit-dialog.component.html',
  styleUrl: './voter-list-empty-voting-cards-edit-dialog.component.scss',
  standalone: false,
})
export class VoterListEmptyVotingCardsEditDialogComponent {
  private readonly dialogRef =
    inject<MatDialogRef<VoterListEmptyVotingCardsEditDialogComponent, VoterListEmptyVotingCardsEditDialogResult>>(MatDialogRef);
  private readonly domainOfInfluenceService = inject(DomainOfInfluenceService);
  private readonly toast = inject(ToastService);

  public isNew = true;
  public deleting = false;
  public saving = false;

  public countOfEmptyVotingCards: number;
  private domainOfInfluenceId: string;

  constructor() {
    const data = inject<VoterListEmptyVotingCardsEditDialogData>(MAT_DIALOG_DATA);
    this.countOfEmptyVotingCards = data.countOfEmptyVotingCards;
    this.domainOfInfluenceId = data.domainOfInfluenceId;
  }

  public async save(): Promise<void> {
    try {
      this.saving = true;
      await this.domainOfInfluenceService.setCountOfEmptyVotingCards(this.domainOfInfluenceId, this.countOfEmptyVotingCards);
      this.toast.saved();
      this.dialogRef.close({
        countOfEmptyVotingCards: this.countOfEmptyVotingCards,
      });
    } finally {
      this.saving = false;
    }
  }

  public done(): void {
    this.dialogRef.close();
  }
}

export interface VoterListEmptyVotingCardsEditDialogData {
  countOfEmptyVotingCards: number;
  domainOfInfluenceId: string;
}

export interface VoterListEmptyVotingCardsEditDialogResult {
  countOfEmptyVotingCards?: number;
}
