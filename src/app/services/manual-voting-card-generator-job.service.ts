/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  CreateManualVotingCardGeneratorJobRequest,
  ListManualVotingCardGeneratorJobsRequest,
  ManualVotingCardGeneratorJobsServiceClient,
} from '@abraxas/voting-stimmunterlagen-proto';
import { Injectable } from '@angular/core';
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
  constructor(
    private readonly client: ManualVotingCardGeneratorJobsServiceClient,
    private readonly fileDownloadService: FileSaveService,
    private readonly i18n: TranslateService,
  ) {}

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
      voter: <ManualVotingCardVoter>{
        ...proto.voter?.toObject(),
        dateOfBirth: proto.voter?.dateOfBirth?.toDate(),
      },
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
