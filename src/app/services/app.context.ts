/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Location } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';

const appInfoSegmentIndex = 1;
const printJobManagementApp = 'print-job-management';
const votingDocumentsApp = 'voting-documents';

@Injectable({
  providedIn: 'root',
})
export class AppContext {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  public get appName(): string {
    const segments = this.router.parseUrl(this.location.path()).root.children.primary?.segments;

    if (!segments || segments.length <= appInfoSegmentIndex) {
      return votingDocumentsApp;
    }

    return segments[appInfoSegmentIndex].path === printJobManagementApp ? printJobManagementApp : votingDocumentsApp;
  }
}
