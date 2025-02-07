/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ManualVotingCardVoter } from '../../../../models/voter.model';
import { EnumItemDescription, EnumUtil } from '../../../../services/enum.util';
import { Salutation } from '@abraxas/voting-stimmunterlagen-proto';
import { fromBcDate, toBcDate } from '../../../../services/utils/date.utils';
import { MaskOptions } from '@abraxas/base-components';

@Component({
  selector: 'app-manual-voting-card-voter-edit',
  templateUrl: './manual-voting-card-voter-edit.component.html',
  styleUrls: ['./manual-voting-card-voter-edit.component.scss'],
})
export class ManualVotingCardVoterEditComponent {
  public readonly salutations: EnumItemDescription<Salutation>[] = [];

  public readonly personIdMaskOptions: MaskOptions = {
    mask: '00000000000',
  } as MaskOptions;

  public voterValue!: ManualVotingCardVoter;
  public swiss = true;
  public dateOfBirth?: string;

  @ViewChild(NgForm, { static: true })
  public form?: NgForm;

  @Input()
  public readOnly = true;

  constructor(
    private readonly i18n: TranslateService,
    enumUtil: EnumUtil,
  ) {
    this.salutations = enumUtil.getArrayWithDescriptions<Salutation>(Salutation, 'SALUTATIONS.');
  }

  @Input()
  public set voter(v: ManualVotingCardVoter) {
    this.voterValue = v;
    this.swiss = v.country.iso2 === 'CH';
    this.dateOfBirth = toBcDate(v.dateOfBirth);
  }

  public updateDateOfBirth(e?: string): void {
    this.dateOfBirth = e;
    this.voterValue.dateOfBirth = fromBcDate(this.dateOfBirth);
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
