/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { PoliticalBusiness } from '../../../../models/political-business.model';

@Component({
  selector: 'app-political-business-table',
  templateUrl: './political-business-table.component.html',
  styleUrls: ['./political-business-table.component.scss'],
  standalone: false,
})
export class PoliticalBusinessTableComponent {
  @Input()
  public politicalBusinesses!: PoliticalBusiness[];
}
