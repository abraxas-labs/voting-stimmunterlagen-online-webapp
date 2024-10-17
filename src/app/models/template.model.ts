/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Template as TemplateProto } from '@abraxas/voting-stimmunterlagen-proto';

export type Template = Required<TemplateProto.AsObject>;

export interface TemplateDataContainer {
  key: string;
  name: string;
  fields: TemplateDataFieldValues[];
}

interface TemplateDataFieldValues {
  key: string;
  name: string;
  value: string;
}

export interface TemplateBrick {
  id: number;
  name: string;
  description: string;
  previewData: string;
  contentId: number;
}

export interface UpdateTemplateBrickContentResponse {
  newBrickId: number;
  newContentId: number;
}
