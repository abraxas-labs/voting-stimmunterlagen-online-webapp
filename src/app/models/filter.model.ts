/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import {
  ElectoralRegisterFilter as ElectoralRegisterFilterProto,
  ElectoralRegisterFilterMetadata as ElectoralRegisterFilterMetadataProto,
} from '@abraxas/voting-stimmunterlagen-proto';
import { ElectoralRegisterFilterVersion as ElectoralRegisterFilterVersionProto } from '@abraxas/voting-stimmunterlagen-proto';

export interface ElectoralRegisterFilter extends Required<ElectoralRegisterFilterProto.AsObject> {}

export interface ElectoralRegisterFilterMetadata extends Omit<Required<ElectoralRegisterFilterMetadataProto.AsObject>, 'actualityDate'> {
  actualityDate: Date | undefined;
}

export interface ElectoralRegisterFilterVersion
  extends Omit<Required<ElectoralRegisterFilterVersionProto.AsObject>, 'deadline' | 'createdAt'> {
  deadline: Date;
  createdAt: Date;
}

export function mapFilterVersion(filterVersion: ElectoralRegisterFilterVersionProto): ElectoralRegisterFilterVersion {
  return {
    ...(<ElectoralRegisterFilterVersion>filterVersion.toObject()),
    deadline: filterVersion.deadline!.toDate(),
    createdAt: filterVersion.createdAt!.toDate(),
  };
}

export function mapFilterMetadata(filterMetadata: ElectoralRegisterFilterMetadataProto): ElectoralRegisterFilterMetadata {
  return {
    ...(<ElectoralRegisterFilterMetadata>filterMetadata.toObject()),
    actualityDate: filterMetadata.actualityDate?.toDate(),
  };
}
