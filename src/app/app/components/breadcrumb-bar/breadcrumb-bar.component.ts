/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbItem } from '../../../models/breadcrumb-item.model';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb-bar',
  templateUrl: './breadcrumb-bar.component.html',
  styleUrls: ['./breadcrumb-bar.component.scss'],
  standalone: false,
})
export class BreadcrumbBarComponent {
  public readonly breadcrumbItems$: Observable<BreadcrumbItem[]>;

  constructor() {
    const breadcrumbService = inject(BreadcrumbService);

    this.breadcrumbItems$ = breadcrumbService.breadcrumbItems$;
  }
}
