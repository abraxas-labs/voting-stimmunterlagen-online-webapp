/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { AttachmentState, VotingCardGeneratorJobState } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, Input, OnInit } from '@angular/core';

type ForegroundColor = 'dark' | 'light';

@Component({
  selector: 'app-attachment-state',
  templateUrl: './attachment-state.component.html',
  styleUrls: ['./attachment-state.component.scss'],
  standalone: false,
})
export class AttachmentStateComponent {
  public stateValue: AttachmentState = AttachmentState.ATTACHMENT_STATE_DEFINED;

  public backgroundColor = '';
  public foregroundColor: ForegroundColor = 'dark';

  @Input()
  public set state(s: AttachmentState) {
    this.stateValue = s;
    this.backgroundColor = this.getBackgroundColor(s);
  }

  private getBackgroundColor(s: AttachmentState): string {
    switch (s) {
      case AttachmentState.ATTACHMENT_STATE_DEFINED:
        return '#e6e7d9';
      case AttachmentState.ATTACHMENT_STATE_DELIVERED:
        return '#e8f4ed';
      case AttachmentState.ATTACHMENT_STATE_REJECTED:
        return '#e9c4c4';
      default:
        return '#fff';
    }
  }
}
