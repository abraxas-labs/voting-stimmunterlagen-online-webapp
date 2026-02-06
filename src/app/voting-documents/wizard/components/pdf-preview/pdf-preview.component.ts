/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Input, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-pdf-preview',
  templateUrl: './pdf-preview.component.html',
  styleUrls: ['./pdf-preview.component.scss'],
  standalone: false,
})
export class PdfPreviewComponent implements OnDestroy {
  @Input()
  public loading = true;

  public url?: string;

  private _data?: Uint8Array;

  @Input()
  public set data(d: Uint8Array | undefined) {
    if (this._data === d) {
      return;
    }

    this.disposeUrl();

    if (!d) {
      return;
    }

    const blob = new Blob([new Uint8Array(d)], { type: 'application/pdf' });
    this.url = URL.createObjectURL(blob);
    this._data = d;
  }

  public ngOnDestroy(): void {
    this.disposeUrl();
  }

  private disposeUrl(): void {
    if (this.url) {
      URL.revokeObjectURL(this.url);
      delete this.url;
    }
  }
}
