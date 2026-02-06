/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-wizard-sidebar-info',
  templateUrl: './wizard-sidebar-info.component.html',
  styleUrls: ['./wizard-sidebar-info.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class WizardSidebarInfoComponent {
  @Input()
  public label = '';

  @Input()
  public content = '';
}
