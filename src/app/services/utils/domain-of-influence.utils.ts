/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { DomainOfInfluenceType } from '@abraxas/voting-stimmunterlagen-proto';

export function isCommunal(doiType: DomainOfInfluenceType) {
  return doiType >= DomainOfInfluenceType.DOMAIN_OF_INFLUENCE_TYPE_MU;
}
