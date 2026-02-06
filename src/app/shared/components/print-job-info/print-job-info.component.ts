/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input } from '@angular/core';
import { PrintJob } from '../../../models/print-job.model';

@Component({
  selector: 'app-print-job-info',
  templateUrl: './print-job-info.component.html',
  styleUrls: ['./print-job-info.component.scss'],
  standalone: false,
})
export class PrintJobInfoComponent {
  @Input()
  public printJob!: PrintJob;
}
