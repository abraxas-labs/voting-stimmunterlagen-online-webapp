/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { VotingCardLayoutDataConfiguration } from '../../../models/voting-card-layout.model';

@Component({
  selector: 'app-voting-card-layout-data-configuration-edit',
  templateUrl: './voting-card-layout-data-configuration-edit.component.html',
  standalone: false,
})
export class VotingCardLayoutDataConfigurationEditComponent {
  private configurationValue!: VotingCardLayoutDataConfiguration;

  public get configuration(): VotingCardLayoutDataConfiguration {
    return this.configurationValue;
  }

  @Input()
  public set configuration(v: VotingCardLayoutDataConfiguration) {
    this.configurationValue = { ...v };
  }

  @Input()
  public disabled: boolean = false;

  @Input()
  public isStistat: boolean = false;

  @Input()
  public isPoliticalAssembly: boolean = false;

  @Output()
  public configurationChange: EventEmitter<VotingCardLayoutDataConfiguration> = new EventEmitter<VotingCardLayoutDataConfiguration>();

  public emitUpdate(): void {
    if (this.configuration.includeDomainOfInfluenceChurch) {
      this.configuration.includeReligion = true;
    }
    this.configurationChange.emit(this.configuration);
  }
}
