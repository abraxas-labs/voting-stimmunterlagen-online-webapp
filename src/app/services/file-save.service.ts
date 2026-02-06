/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Injectable, Renderer2, DOCUMENT, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FileSaveService {
  private document = inject<Document>(DOCUMENT);

  public savePdf(data: Uint8Array, fileName: string): void {
    this.saveFile(data, fileName, 'application/pdf');
  }

  public saveFile(data: Uint8Array, fileName: string, mimeType: string): void {
    const blob = new Blob([new Uint8Array(data)], {
      type: mimeType,
    });
    const url = window.URL.createObjectURL(blob);
    this.saveFileFromUrl(url, fileName);

    // after 1s the download should be completed
    // (since data is only transferred locally this should be quite quick)
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
  }

  private saveFileFromUrl(url: string, fileName: string): void {
    const a = <HTMLAnchorElement>this.document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none';

    this.document.body.appendChild(a);

    a.click();
    a.remove();
  }
}
