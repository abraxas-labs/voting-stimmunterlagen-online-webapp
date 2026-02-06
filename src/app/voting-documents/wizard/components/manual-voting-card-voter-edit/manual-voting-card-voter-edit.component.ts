/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, ViewChild, inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ManualVotingCardVoter } from '../../../../models/voter.model';
import { EnumItemDescription, EnumUtil } from '../../../../services/enum.util';
import { Religion, Salutation } from '@abraxas/voting-stimmunterlagen-proto';
import { fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { VotingCardLayoutDataConfiguration } from '../../../..//models/voting-card-layout.model';

@Component({
  selector: 'app-manual-voting-card-voter-edit',
  templateUrl: './manual-voting-card-voter-edit.component.html',
  styleUrls: ['./manual-voting-card-voter-edit.component.scss'],
  standalone: false,
})
export class ManualVotingCardVoterEditComponent {
  private readonly i18n = inject(TranslateService);

  public readonly salutations: EnumItemDescription<Salutation>[] = [];
  public readonly religions: EnumItemDescription<Religion>[] = [];

  public voterValue!: ManualVotingCardVoter;
  public options!: VotingCardLayoutDataConfiguration;
  public swiss = true;
  public dateOfBirth?: string;
  public printEmpty = false;

  public swissZipCodeIsValid = false;
  public dateOfBirthIsValid = false;
  public religionIsValid = false;

  @ViewChild(NgForm, { static: true })
  public form?: NgForm;

  @Input()
  public disabled = false;

  @Input()
  public set configuration(c: VotingCardLayoutDataConfiguration) {
    this.options = c;
    this.dateOfBirthIsValid = !c.includeDateOfBirth;
    this.religionIsValid = !c.includeReligion;
  }

  @Input()
  public set voter(v: ManualVotingCardVoter) {
    this.voterValue = v;
    this.swiss = v.country.iso2 === 'CH';
    this.dateOfBirth = toBcDate(v.dateOfBirth);
  }

  constructor() {
    const enumUtil = inject(EnumUtil);
    this.salutations = enumUtil.getArrayWithDescriptions<Salutation>(Salutation, 'SALUTATIONS.');
    this.religions = enumUtil.getArrayWithDescriptions<Religion>(Religion, 'RELIGIONS.');
  }

  public get isValidVoter(): boolean {
    return !!this.form && this.form.valid === true && this.swissZipCodeIsValid && this.dateOfBirthIsValid && this.religionIsValid;
  }

  public updateSwissZipCode(e?: number): void {
    this.voterValue.swissZipCode = e;
    // Can be removed if jira BC-766 is fixed.
    this.swissZipCodeIsValid = !!this.voterValue.swissZipCode && this.voterValue.swissZipCode >= 1000;
  }

  public updateDateOfBirth(birthdate?: string): void {
    this.dateOfBirthIsValid = !!birthdate || this.configuration?.includeDateOfBirth;
    if (!birthdate) {
      delete this.voterValue.dateOfBirth;
      delete this.dateOfBirth;
    } else {
      this.dateOfBirth = birthdate;
      this.voterValue.dateOfBirth = fromBcDate(this.dateOfBirth);
    }
  }

  public updateReligionCode(religion: Religion): void {
    this.religionIsValid = !!religion || this.configuration?.includeReligion;
    this.voterValue.religion = religion ?? Religion.RELIGION_UNSPECIFIED;
  }

  public updateSwiss(b: boolean): void {
    this.swiss = b;
    if (b) {
      delete this.voterValue.foreignZipCode; // needs to be deleted explicitly to make oneof work correctly.
      this.voterValue.country = { iso2: 'CH', name: this.i18n.instant('COUNTRY.CH') };
    } else {
      delete this.voterValue.swissZipCode;
      this.voterValue.foreignZipCode = '';
      this.voterValue.country = { iso2: '', name: '' };
    }
  }
}
