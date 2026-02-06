/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  CreateEmptyManualVotingCardGeneratorJobRequest,
  CreateManualVotingCardGeneratorJobRequest,
  ListManualVotingCardGeneratorJobsRequest,
  ManualVotingCardGeneratorJobsServiceClient,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ManualVotingCardGeneratorJob, ManualVotingCardGeneratorJobProto } from '../models/manual-voting-card-generator-job.model';
import { User } from '../models/user.model';
import { ManualVotingCardVoter } from '../models/voter.model';
import { FileSaveService } from './file-save.service';
import { firstValueFrom } from 'rxjs';
import { Int32Value, Timestamp } from '@ngx-grpc/well-known-types';

@Injectable({
  providedIn: 'root',
})
export class ManualVotingCardGeneratorJobService {
  private readonly client = inject(ManualVotingCardGeneratorJobsServiceClient);
  private readonly fileDownloadService = inject(FileSaveService);
  private readonly i18n = inject(TranslateService);

  public async createEmpty(domainOfInfluenceId: string): Promise<void> {
    const pdf = await firstValueFrom(
      this.client.createEmpty(
        new CreateEmptyManualVotingCardGeneratorJobRequest({
          domainOfInfluenceId,
        }),
      ),
    ).then(x => x.pdf!);
    this.fileDownloadService.savePdf(pdf, this.i18n.instant('STEP_GENERATE_MANUAL_VOTING_CARDS.FILE_NAME'));
  }

  public async create(domainOfInfluenceId: string, voter: ManualVotingCardVoter): Promise<void> {
    const pdf = await firstValueFrom(
      this.client.create(
        new CreateManualVotingCardGeneratorJobRequest({
          domainOfInfluenceId,
          voter: {
            ...voter,
            dateOfBirth: !!voter.dateOfBirth ? Timestamp.fromDate(voter.dateOfBirth!) : undefined,
            swissZipCode: this.createInt32Value(voter.swissZipCode),
          },
        }),
      ),
    ).then(x => x.pdf!);
    this.fileDownloadService.savePdf(pdf, this.i18n.instant('STEP_GENERATE_MANUAL_VOTING_CARDS.FILE_NAME'));
  }

  public list(domainOfInfluenceId: string): Promise<ManualVotingCardGeneratorJob[]> {
    return firstValueFrom(this.client.list(new ListManualVotingCardGeneratorJobsRequest({ domainOfInfluenceId }))).then(x =>
      x.jobs!.map(j => this.mapManualVotingCardGeneratorJob(j)),
    );
  }

  private mapManualVotingCardGeneratorJob(proto: ManualVotingCardGeneratorJobProto): ManualVotingCardGeneratorJob {
    return {
      id: proto.id!,
      created: proto.created!.toDate(),
      createdBy: <User>proto.createdBy,
      voter: proto.voter
        ? <ManualVotingCardVoter>{
            ...proto.voter?.toObject(),
            dateOfBirth: proto.voter?.dateOfBirth?.toDate(),
          }
        : undefined,
    };
  }

  private createInt32Value(v: number | undefined): Int32Value | undefined {
    if (v === undefined || v === null) {
      return;
    }

    const proto = new Int32Value();
    proto.value = v;
    return proto;
  }
}
