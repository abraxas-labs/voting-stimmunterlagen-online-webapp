/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-domain-of-influence-e-voting-ready',
  templateUrl: './domain-of-influence-e-voting-ready.component.html',
  styleUrls: ['./domain-of-influence-e-voting-ready.component.scss'],
  standalone: false,
})
export class DomainOfInfluenceEVotingReadyComponent {
  @Input()
  public ready = false;
}
