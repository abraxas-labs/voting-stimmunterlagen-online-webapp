/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AdditionalInvoicePositionServiceClient,
  CreateAdditionalInvoicePositionRequest,
  UpdateAdditionalInvoicePositionRequest,
  ListAdditionalInvoicePositionsRequest,
  IdValueRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  AdditionalInvoicePosition,
  AdditionalInvoicePositionAvailableMaterial,
  mapAdditionalInvoicePositionAvailableMaterial,
  mapAdditionalInvoicePositions,
} from '../models/additional-invoice-position.model';
import { Empty } from '@ngx-grpc/well-known-types';

@Injectable({
  providedIn: 'root',
})
export class AdditionalInvoicePositionService {
  constructor(private readonly client: AdditionalInvoicePositionServiceClient) {}

  public create(position: AdditionalInvoicePosition): Promise<string> {
    return firstValueFrom(
      this.client.create(
        new CreateAdditionalInvoicePositionRequest({
          ...position,
          domainOfInfluenceId: position.domainOfInfluence.id,
          amountCentime: Math.round(position.amount * 100), // prevent floating errors
        }),
      ),
    ).then(({ id }) => id!);
  }

  public async update(position: AdditionalInvoicePosition): Promise<void> {
    await firstValueFrom(
      this.client.update(
        new UpdateAdditionalInvoicePositionRequest({
          ...position,
          domainOfInfluenceId: position.domainOfInfluence.id,
          amountCentime: Math.round(position.amount * 100), // prevent floating errors
        }),
      ),
    );
  }

  public async delete(id: string): Promise<void> {
    await firstValueFrom(this.client.delete(new IdValueRequest({ id })));
  }

  public list(contestId: string): Promise<AdditionalInvoicePosition[]> {
    return firstValueFrom(this.client.list(new ListAdditionalInvoicePositionsRequest({ contestId }))).then(x =>
      mapAdditionalInvoicePositions(x.positions!),
    );
  }

  public listAvailableMaterial(): Promise<AdditionalInvoicePositionAvailableMaterial[]> {
    return firstValueFrom(this.client.listAvailableMaterial(new Empty())).then(x =>
      x.materials!.map(mapAdditionalInvoicePositionAvailableMaterial),
    );
  }
}
