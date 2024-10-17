/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItem } from '../../../models/breadcrumb-item.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb-bar',
  templateUrl: './breadcrumb-bar.component.html',
  styleUrls: ['./breadcrumb-bar.component.scss'],
})
export class BreadcrumbBarComponent {
  public readonly breadcrumbItems$: Observable<BreadcrumbItem[]>;

  constructor(breadcrumbService: BreadcrumbService) {
    this.breadcrumbItems$ = breadcrumbService.breadcrumbItems$;
  }
}
