/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  AttachmentServiceClient,
  ListAttachmentCategorySummariesRequest,
  CreateAttachmentRequest,
  UpdateAttachmentRequest,
  AssignPoliticalBusinessAttachmentRequest,
  UnassignPoliticalBusinessAttachmentRequest,
  SetDomainOfInfluenceAttachmentRequiredCountRequest,
  SetAttachmentStationRequest,
  SetAttachmentStateRequest,
  ListAttachmentCategorySummariesFilterRequest,
  ListDomainOfInfluenceAttachmentCategorySummariesRequest,
  UpdateDomainOfInfluenceAttachmentEntriesRequest,
  ListDomainOfInfluenceAttachmentCountsRequest,
  GetAttachmentsProgressRequest,
  IdValueRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { Timestamp } from '@ngx-grpc/well-known-types';
import {
  Attachment,
  AttachmentState,
  DomainOfInfluenceAttachmentCategorySummariesEntry,
  mapDomainOfInfluenceAttachmentCategorySummariesEntries,
  mapDomainOfInfluenceAttachmentCount,
  DomainOfInfluenceAttachmentCount,
  mapAttachmentCategorySummaries,
  AttachmentCategorySummary,
  AttachmentsProgress,
} from '../models/attachment.model';
import { flatten } from './utils/array.utils';
import { firstValueFrom } from 'rxjs';
import { sortByCategory } from './utils/attachment.utils';

@Injectable({
  providedIn: 'root',
})
export class AttachmentService {
  private readonly client = inject(AttachmentServiceClient);

  public create(attachment: Attachment): Promise<string> {
    return firstValueFrom(
      this.client.create(
        new CreateAttachmentRequest({
          ...attachment,
          politicalBusinessIds: this.getPoliticalBusinessIds(attachment),
          deliveryPlannedOn: attachment.deliveryPlannedOn ? Timestamp.fromDate(attachment.deliveryPlannedOn) : undefined,
          domainOfInfluenceId: attachment.domainOfInfluence.id,
          requiredCount: attachment.domainOfInfluenceAttachmentRequiredCount,
        }),
      ),
    ).then(({ id }) => id!);
  }

  public async update(attachment: Attachment): Promise<void> {
    await firstValueFrom(
      this.client.update(
        new UpdateAttachmentRequest({
          ...attachment,
          politicalBusinessIds: this.getPoliticalBusinessIds(attachment),
          deliveryPlannedOn: attachment.deliveryPlannedOn ? Timestamp.fromDate(attachment.deliveryPlannedOn) : undefined,
          requiredCount: attachment.domainOfInfluenceAttachmentRequiredCount,
        }),
      ),
    );
  }

  public async delete(id: string): Promise<void> {
    await firstValueFrom(this.client.delete(new IdValueRequest({ id })));
  }

  public listCategorySummaries(domainOfInfluenceId: string): Promise<AttachmentCategorySummary[]> {
    return firstValueFrom(this.client.listCategorySummaries(new ListAttachmentCategorySummariesRequest({ domainOfInfluenceId }))).then(
      x => {
        const summaries = mapAttachmentCategorySummaries(x);
        sortByCategory(v => v.category, summaries);
        return summaries;
      },
    );
  }

  public listCategorySummariesForPrintJobManagement(
    contestId: string,
    state: AttachmentState,
    query: string,
  ): Promise<AttachmentCategorySummary[]> {
    return firstValueFrom(
      this.client.listCategorySummaries(
        new ListAttachmentCategorySummariesRequest({
          filter: new ListAttachmentCategorySummariesFilterRequest({ state, contestId, query }),
        }),
      ),
    ).then(x => {
      const summaries = mapAttachmentCategorySummaries(x);
      sortByCategory(v => v.category, summaries);
      return summaries;
    });
  }

  public async listAttachmentsGroupedByPoliticalBusiness(domainOfInfluenceId: string): Promise<Record<string, Attachment[]>> {
    const attachmentCategorySummaries = await this.listCategorySummaries(domainOfInfluenceId);
    const attachments = flatten(attachmentCategorySummaries.map(s => s.attachments));
    const v = {} as Record<string, Attachment[]>;

    for (const attachment of attachments) {
      for (const pbId of attachment.politicalBusinessIds) {
        v[pbId] = [...(v[pbId] ?? []), attachment];
      }
    }

    return v;
  }

  public async listDomainOfInfluenceAttachmentCategorySummaries(
    domainOfInfluenceId: string,
  ): Promise<DomainOfInfluenceAttachmentCategorySummariesEntry[]> {
    return firstValueFrom(
      await this.client.listDomainOfInfluenceAttachmentCategorySummaries(
        new ListDomainOfInfluenceAttachmentCategorySummariesRequest({ domainOfInfluenceId }),
      ),
    ).then(res => {
      const doiSummaries = mapDomainOfInfluenceAttachmentCategorySummariesEntries(res);
      for (const doiSummary of doiSummaries) {
        sortByCategory(v => v.category, doiSummary.attachmentCategorySummaries);
      }
      return doiSummaries;
    });
  }

  public assignPoliticalBusiness(id: string, politicalBusinessId: string) {
    return firstValueFrom(
      this.client.assignPoliticalBusiness(
        new AssignPoliticalBusinessAttachmentRequest({
          id,
          politicalBusinessId,
        }),
      ),
    );
  }

  public unassignPoliticalBusiness(id: string, politicalBusinessId: string) {
    return firstValueFrom(
      this.client.unassignPoliticalBusiness(
        new UnassignPoliticalBusinessAttachmentRequest({
          id,
          politicalBusinessId,
        }),
      ),
    );
  }

  public setDomainOfInfluenceAttachmentRequiredCount(id: string, domainOfInfluenceId: string, requiredCount: number) {
    return firstValueFrom(
      this.client.setDomainOfInfluenceAttachmentRequiredCount(
        new SetDomainOfInfluenceAttachmentRequiredCountRequest({
          id,
          domainOfInfluenceId,
          requiredCount,
        }),
      ),
    );
  }

  public setStation(id: string, station: number) {
    return firstValueFrom(
      this.client.setStation(
        new SetAttachmentStationRequest({
          id,
          station,
        }),
      ),
    );
  }

  public setState(id: string, state: AttachmentState, comment: string) {
    return firstValueFrom(
      this.client.setState(
        new SetAttachmentStateRequest({
          id,
          state,
          comment,
        }),
      ),
    );
  }

  public updateDomainOfInfluenceAttachmentEntries(id: string, domainOfInfluenceIds: string[]) {
    return firstValueFrom(
      this.client.updateDomainOfInfluenceAttachmentEntries(
        new UpdateDomainOfInfluenceAttachmentEntriesRequest({
          id,
          domainOfInfluenceIds,
        }),
      ),
    );
  }

  public listDomainOfInfluenceAttachmentCounts(attachmentId: string): Promise<DomainOfInfluenceAttachmentCount[]> {
    return firstValueFrom(
      this.client.listDomainOfInfluenceAttachmentCounts(
        new ListDomainOfInfluenceAttachmentCountsRequest({
          attachmentId,
        }),
      ),
    ).then(res => res.counts!.map(c => mapDomainOfInfluenceAttachmentCount(c)));
  }

  public getAttachmentsProgress(contestId: string): Promise<AttachmentsProgress> {
    return firstValueFrom(
      this.client.getAttachmentsProgress(
        new GetAttachmentsProgressRequest({
          contestId,
        }),
      ),
    ).then(res => ({ stationsSet: res.stationsSet! }));
  }

  private getPoliticalBusinessIds(attachment: Attachment): string[] {
    return attachment.checkablePoliticalBusinesses.items.filter(pb => pb.checked).map(pb => pb.item.id);
  }
}
