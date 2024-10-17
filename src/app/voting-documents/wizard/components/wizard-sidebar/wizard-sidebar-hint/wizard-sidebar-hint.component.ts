/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wizard-sidebar-hint',
  templateUrl: './wizard-sidebar-hint.component.html',
  styleUrls: ['./wizard-sidebar-hint.component.scss'],
})
export class WizardSidebarHintComponent {
  @Input()
  public hint = '';
}
