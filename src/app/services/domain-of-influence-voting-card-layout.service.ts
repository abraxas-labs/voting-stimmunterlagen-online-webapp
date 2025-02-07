/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  DomainOfInfluenceVotingCardLayoutServiceClient,
  GetContestDomainOfInfluenceVotingCardLayoutsRequest,
  GetDomainOfInfluenceVotingCardLayoutPdfPreviewRequest,
  GetDomainOfInfluenceVotingCardLayoutsRequest,
  GetDomainOfInfluenceVotingCardLayoutTemplateDataRequest,
  GetDomainOfInfluenceVotingCardLayoutTemplatesRequest,
  SetDomainOfInfluenceVotingCardLayoutRequest,
  SetDomainOfInfluenceVotingCardLayoutTemplateDataRequest,
  SetOverriddenDomainOfInfluenceVotingCardLayoutRequest,
  VotingCardType,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
import {
  DomainOfInfluenceVotingCardLayout,
  DomainOfInfluenceVotingCardLayouts,
} from '../models/domain-of-influence-voting-card-layout.model';
import { DomainOfInfluence } from '../models/domain-of-influence.model';
import { Template, TemplateDataContainer } from '../models/template.model';
import { flatten, groupBySingle } from './utils/array.utils';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceVotingCardLayoutService {
  constructor(private readonly client: DomainOfInfluenceVotingCardLayoutServiceClient) {}

  public async getLayoutsForContest(contestId: string): Promise<DomainOfInfluenceVotingCardLayouts[]> {
    const layoutGroups = await firstValueFrom(
      this.client.getContestLayouts(new GetContestDomainOfInfluenceVotingCardLayoutsRequest({ contestId })),
    ).then(x => x.toObject().layoutGroups ?? []);

    return layoutGroups.map(lg => ({
      domainOfInfluence: lg.domainOfInfluence as DomainOfInfluence,
      layouts: groupBySingle(
        lg.layouts ?? [],
        l => l.votingCardType!,
        l => l as DomainOfInfluenceVotingCardLayout,
      ),
    }));
  }

  public getLayouts(domainOfInfluenceId: string): Promise<DomainOfInfluenceVotingCardLayout[]> {
    return firstValueFrom(this.client.getLayouts(new GetDomainOfInfluenceVotingCardLayoutsRequest({ domainOfInfluenceId }))).then(
      x => x.toObject().layouts as DomainOfInfluenceVotingCardLayout[],
    );
  }

  public getTemplates(contestId: string): Promise<Template[]> {
    return firstValueFrom(this.client.getTemplates(new GetDomainOfInfluenceVotingCardLayoutTemplatesRequest({ contestId }))).then(
      x => x.toObject().templates as Template[],
    );
  }

  public getTemplateData(domainOfInfluenceId: string): Promise<TemplateDataContainer[]> {
    return firstValueFrom(
      this.client.getTemplateData(new GetDomainOfInfluenceVotingCardLayoutTemplateDataRequest({ domainOfInfluenceId })),
    ).then(x => x.toObject().containers as TemplateDataContainer[]);
  }

  public async setTemplateData(domainOfInfluenceId: string, data: TemplateDataContainer[]): Promise<void> {
    await firstValueFrom(
      this.client.setTemplateData(
        new SetDomainOfInfluenceVotingCardLayoutTemplateDataRequest({
          domainOfInfluenceId,
          fields: flatten(data.map(c => c.fields.map(f => ({ value: f.value, fieldKey: f.key, containerKey: c.key })))),
        }),
      ),
    );
  }

  public getPdfPreview(domainOfInfluenceId: string, votingCardType: VotingCardType): Promise<Uint8Array> {
    return firstValueFrom(
      this.client.getPdfPreview(new GetDomainOfInfluenceVotingCardLayoutPdfPreviewRequest({ domainOfInfluenceId, votingCardType })),
    ).then(x => x.pdf!);
  }

  public async setLayout(domainOfInfluenceId: string, layout: DomainOfInfluenceVotingCardLayout): Promise<void> {
    await firstValueFrom(
      this.client.setLayout(
        new SetDomainOfInfluenceVotingCardLayoutRequest({
          ...layout,
          domainOfInfluenceId,
          templateId: (layout.domainOfInfluenceTemplate?.id ?? 0 > 0) ? { value: layout.domainOfInfluenceTemplate!.id } : undefined,
        }),
      ),
    );
  }

  public async setOverriddenLayout(domainOfInfluenceId: string, layout: DomainOfInfluenceVotingCardLayout): Promise<void> {
    await firstValueFrom(
      this.client.setOverriddenLayout(
        new SetOverriddenDomainOfInfluenceVotingCardLayoutRequest({
          ...layout,
          domainOfInfluenceId,
          templateId: (layout.overriddenTemplate?.id ?? 0 > 0) ? { value: layout.overriddenTemplate!.id } : undefined,
        }),
      ),
    );
  }
}
