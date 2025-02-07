/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DomainOfInfluence } from './domain-of-influence.model';
import {
  AdditionalInvoicePosition as AdditionalInvoicePositionProto,
  AdditionalInvoicePositionAvailableMaterial as AdditionalInvoicePositionAvailableMaterialProto,
} from '@abraxas/voting-stimmunterlagen-proto';
import { User } from './user.model';

export interface AdditionalInvoicePosition {
  id: string;
  domainOfInfluence: DomainOfInfluence;
  materialNumber: string;
  amount: number;
  created: Date;
  createdBy: User;
  material?: AdditionalInvoicePositionAvailableMaterial;
  comment: string;
}

export interface AdditionalInvoicePositionAvailableMaterial {
  number: string;
  description: string;
  displayText: string;
  commentRequired: boolean;
}

export function newAdditionalInvoicePosition(): AdditionalInvoicePosition {
  return <AdditionalInvoicePosition>{};
}

export function mapAdditionalInvoicePositions(positions: AdditionalInvoicePositionProto[]): AdditionalInvoicePosition[] {
  return positions.map(e => mapAdditionalInvoicePosition(e));
}

export function mapAdditionalInvoicePositionAvailableMaterial(
  proto: AdditionalInvoicePositionAvailableMaterialProto,
): AdditionalInvoicePositionAvailableMaterial {
  return {
    ...(<Required<AdditionalInvoicePositionAvailableMaterialProto.AsObject>>proto.toObject()),
    displayText: `${proto.description} (${proto.number})`,
  };
}

function mapAdditionalInvoicePosition(proto: AdditionalInvoicePositionProto): AdditionalInvoicePosition {
  return {
    ...(<Required<AdditionalInvoicePositionProto.AsObject>>proto.toObject()),
    domainOfInfluence: <DomainOfInfluence>proto.domainOfInfluence!.toObject(),
    created: proto.created!.toDate(),
    createdBy: <User>proto.createdBy,
    amount: proto.amountCentime! / 100,
  };
}
