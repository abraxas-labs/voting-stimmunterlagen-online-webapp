/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { User as UserProto } from '@abraxas/voting-stimmunterlagen-proto';

export { UserProto };
export type User = Required<UserProto.AsObject>;
