/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardGeneratorJobState } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, Input } from '@angular/core';

type ForegroundColor = 'dark' | 'light';

@Component({
  selector: 'app-voting-card-generator-job-state',
  templateUrl: './voting-card-generator-job-state.component.html',
  styleUrls: ['./voting-card-generator-job-state.component.scss'],
})
export class VotingCardGeneratorJobStateComponent {
  public stateValue: VotingCardGeneratorJobState = VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_READY;

  public backgroundColor = '';
  public foregroundColor: ForegroundColor = 'light';

  @Input()
  public set state(s: VotingCardGeneratorJobState) {
    this.stateValue = s;
    this.backgroundColor = this.getBackgroundColor(s);
    this.foregroundColor = this.getForegroundColor(s);
  }

  private getForegroundColor(s: VotingCardGeneratorJobState): ForegroundColor {
    switch (s) {
      case VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_COMPLETED:
        return 'light';
      default:
        return 'dark';
    }
  }

  private getBackgroundColor(s: VotingCardGeneratorJobState): string {
    switch (s) {
      case VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_READY:
        return '#c0c0c0';
      case VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_RUNNING:
        return '#c2d200';
      case VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_COMPLETED:
        return '#1c9048';
      case VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_FAILED:
        return '#ff7171';
      case VotingCardGeneratorJobState.VOTING_CARD_GENERATOR_JOB_STATE_READY_TO_RUN_OFFLINE:
        return '#c0c0c0';
      default:
        return '#fff';
    }
  }
}
