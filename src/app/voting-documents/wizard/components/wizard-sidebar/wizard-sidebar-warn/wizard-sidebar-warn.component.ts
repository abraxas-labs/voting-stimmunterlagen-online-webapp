/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wizard-sidebar-warn',
  templateUrl: './wizard-sidebar-warn.component.html',
  styleUrls: ['./wizard-sidebar-warn.component.scss'],
})
export class WizardSidebarWarnComponent {
  @Input()
  public warn = '';
}
