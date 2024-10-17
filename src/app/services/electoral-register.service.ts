/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  CreateVoterListImportWithNewElectoralRegisterFilterVersionRequest,
  ElectoralRegisterServiceClient,
  GetElectoralRegisterFilterMetadataRequest,
  GetElectoralRegisterFilterVersionRequest,
  ListElectoralRegisterFilterVersionsRequest,
  UpdateVoterListImportWithNewElectoralRegisterFilterVersionRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Empty, Timestamp } from '@ngx-grpc/well-known-types';
import {
  ElectoralRegisterFilter,
  ElectoralRegisterFilterMetadata,
  ElectoralRegisterFilterVersion,
  mapFilterMetadata,
  mapFilterVersion,
} from '../models/filter.model';
import {
  VoterListImportWithElectoralRegisterResponse,
  mapVoterListImportWithElectoralRegisterResponse,
} from '../models/electoral-register.model';

@Injectable({
  providedIn: 'root',
})
export class ElectoralRegisterService {
  constructor(private readonly client: ElectoralRegisterServiceClient) {}

  public async createVoterListImportWithNewFilterVersion(
    domainOfInfluenceId: string,
    filter: { filterId: string; filterVersionName: string; filterVersionDeadline: Date },
  ): Promise<VoterListImportWithElectoralRegisterResponse> {
    const response = await firstValueFrom(
      this.client.createVoterListImportWithNewFilterVersion(
        new CreateVoterListImportWithNewElectoralRegisterFilterVersionRequest({
          ...filter,
          filterVersionDeadline: Timestamp.fromDate(filter.filterVersionDeadline),
          domainOfInfluenceId,
        }),
      ),
    );
    return mapVoterListImportWithElectoralRegisterResponse(response);
  }

  public async updateVoterListImportWithNewFilterVersion(
    importId: string,
    filter: { filterId: string; filterVersionName: string; filterVersionDeadline: Date },
  ): Promise<VoterListImportWithElectoralRegisterResponse> {
    const response = await firstValueFrom(
      this.client.updateVoterListImportWithNewFilterVersion(
        new UpdateVoterListImportWithNewElectoralRegisterFilterVersionRequest({
          ...filter,
          importId,
          filterVersionDeadline: Timestamp.fromDate(filter.filterVersionDeadline),
        }),
      ),
    );
    return mapVoterListImportWithElectoralRegisterResponse(response);
  }

  public async listFilters(): Promise<ElectoralRegisterFilter[]> {
    const response = await firstValueFrom(this.client.listFilters(new Empty()));
    return <ElectoralRegisterFilter[]>response.toObject().filters;
  }

  public async listFilterVersions(filterId: string): Promise<ElectoralRegisterFilterVersion[]> {
    const response = await firstValueFrom(this.client.listFilterVersions(new ListElectoralRegisterFilterVersionsRequest({ filterId })));
    return response.versions!.map(v => mapFilterVersion(v));
  }

  public async getFilterVersion(
    filterVersionId: string,
  ): Promise<{ filter: ElectoralRegisterFilter; filterVersion: ElectoralRegisterFilterVersion }> {
    const response = await firstValueFrom(this.client.getFilterVersion(new GetElectoralRegisterFilterVersionRequest({ filterVersionId })));
    return {
      filter: <ElectoralRegisterFilter>response.filter!.toObject(),
      filterVersion: mapFilterVersion(response.version!),
    };
  }

  public async getFilterMetadata(filterId: string, deadline: Date): Promise<ElectoralRegisterFilterMetadata> {
    const request = new GetElectoralRegisterFilterMetadataRequest({ filterId, deadline: Timestamp.fromDate(deadline) });
    const response = await firstValueFrom(this.client.getFilterMetadata(request));
    return mapFilterMetadata(response);
  }
}
