/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { IdValueRequest, VoterListImportServiceClient } from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { MultipartFormDataHttpService } from './http/multipart-form-data-http.service';
import { firstValueFrom } from 'rxjs';
import { VoterListImport, VoterListImportResponse, mapVoterListImport } from '../models/voter-list-import.model';

@Injectable({
  providedIn: 'root',
})
export class VoterListImportService {
  private readonly client = inject(VoterListImportServiceClient);
  private readonly http = inject(MultipartFormDataHttpService);

  private readonly restApiUrl: string = '';

  constructor() {
    this.restApiUrl = `${environment.restApiEndpoint}/voter-list-import`;
  }

  public async delete(id: string): Promise<void> {
    await firstValueFrom(this.client.delete(new IdValueRequest({ id })));
  }

  public async create(voterListImport: VoterListImport, domainOfInfluenceId: string, file: File): Promise<VoterListImportResponse> {
    return await this.http.post<CreateUpdateVoterListImportRequest, VoterListImportResponse>(
      this.restApiUrl,
      this.mapToCreateUpdateRequest(voterListImport, domainOfInfluenceId),
      file,
    );
  }

  public async update(voterListImport: VoterListImport, file?: File): Promise<VoterListImportResponse> {
    return await this.http.put<CreateUpdateVoterListImportRequest, VoterListImportResponse>(
      `${this.restApiUrl}/${voterListImport.id}`,
      this.mapToCreateUpdateRequest(voterListImport),
      file,
    );
  }

  public get(voterListImportId: string): Promise<VoterListImport> {
    return firstValueFrom(this.client.get(new IdValueRequest({ id: voterListImportId }))).then(x => mapVoterListImport(x));
  }

  private mapToCreateUpdateRequest(voterListImport: VoterListImport, domainOfInfluenceId?: string): CreateUpdateVoterListImportRequest {
    return {
      ...voterListImport,
      domainOfInfluenceId,
    };
  }
}

export interface CreateUpdateVoterListImportRequest {
  id: string;
  lastUpdate: Date;
  name: string;
  domainOfInfluenceId?: string;
}
