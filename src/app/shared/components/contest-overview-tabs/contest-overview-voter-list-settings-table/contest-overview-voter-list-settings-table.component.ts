/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { DomainOfInfluenceService } from '../../../../services/domain-of-influence.service';
import { ToastService } from '../../../../services/toast.service';

@Component({
  selector: 'app-contest-overview-voter-list-settings-table',
  templateUrl: './contest-overview-voter-list-settings-table.component.html',
  styleUrls: ['contest-overview-voter-list-settings-table.component.scss'],
})
export class ContestOverviewVoterListSettingsTableComponent {
  public readonly columns = ['name', 'allowManualVoterListUpload'];

  @Input()
  public domainOfInfluences: DomainOfInfluence[] = [];

  public saving: boolean = false;

  constructor(private readonly domainOfInfluenceService: DomainOfInfluenceService, private readonly toast: ToastService) {}

  public async setAllowManualVoterListUpload(doi: DomainOfInfluence, allowManualVoterListUpload: boolean): Promise<void> {
    if (allowManualVoterListUpload === doi.allowManualVoterListUpload) {
      return;
    }

    try {
      this.saving = true;
      doi.allowManualVoterListUpload = allowManualVoterListUpload;
      await this.domainOfInfluenceService.updateSettings(doi.id, allowManualVoterListUpload);
      this.toast.saved();
    } finally {
      this.saving = false;
    }
  }
}
