/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  DomainOfInfluenceVotingCardBrickServiceClient,
  GetDomainOfInfluenceVotingCardBrickContentEditorUrlRequest,
  ListDomainOfInfluenceVotingCardBrickRequest,
  UpdateDomainOfInfluenceVotingCardBrickContentRequest,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TemplateBrick, UpdateTemplateBrickContentResponse } from '../models/template.model';

@Injectable({
  providedIn: 'root',
})
export class DomainOfInfluenceVotingCardBrickService {
  private readonly client = inject(DomainOfInfluenceVotingCardBrickServiceClient);

  public list(templateId: number): Promise<TemplateBrick[]> {
    return firstValueFrom(this.client.list(new ListDomainOfInfluenceVotingCardBrickRequest({ templateId }))).then(
      x => x.toObject().bricks as TemplateBrick[],
    );
  }

  public getContentEditorUrl({ id, contentId }: TemplateBrick): Promise<string> {
    return firstValueFrom(
      this.client.getContentEditorUrl(new GetDomainOfInfluenceVotingCardBrickContentEditorUrlRequest({ brickId: id, contentId })),
    ).then(x => x.toObject()!.url!);
  }

  public updateContent(contentId: number, content: string): Promise<UpdateTemplateBrickContentResponse> {
    return firstValueFrom(this.client.updateContent(new UpdateDomainOfInfluenceVotingCardBrickContentRequest({ contentId, content }))).then(
      x => x.toObject()! as UpdateTemplateBrickContentResponse,
    );
  }
}
