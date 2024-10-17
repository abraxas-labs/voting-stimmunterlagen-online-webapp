/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DomainOfInfluence as DomainOfInfluenceProto, DomainOfInfluenceType } from '@abraxas/voting-stimmunterlagen-proto';

export { DomainOfInfluenceType };

export interface DomainOfInfluence extends Omit<Required<DomainOfInfluenceProto.AsObject>, 'lastVoterUpdate'> {
  lastVoterUpdate?: Date;
}

export function mapDomainOfInfluence(doiProto: DomainOfInfluenceProto): DomainOfInfluence {
  return {
    ...(<Required<DomainOfInfluenceProto.AsObject>>doiProto.toObject()),
    lastVoterUpdate: doiProto.lastVoterUpdate?.toDate(),
  };
}
