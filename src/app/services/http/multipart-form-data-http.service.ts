/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MultipartFormDataHttpService {
  constructor(private readonly http: HttpClient) {}

  public async post<TData, TResponse>(url: string, data: TData, file?: File): Promise<TResponse> {
    return firstValueFrom(this.http.post<TResponse>(url, this.buildFormData(data, file)));
  }

  public async put<TData, TResponse>(url: string, data: TData, file?: File): Promise<TResponse> {
    return firstValueFrom(this.http.put<TResponse>(url, this.buildFormData(data, file)));
  }

  private buildFormData(data: any, file?: File): FormData {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (!!file) {
      formData.append('file', file);
    }

    return formData;
  }
}
