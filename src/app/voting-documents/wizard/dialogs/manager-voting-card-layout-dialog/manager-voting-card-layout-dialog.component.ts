/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import {
  DomainOfInfluenceVotingCardLayout,
  DomainOfInfluenceVotingCardLayouts,
} from '../../../../models/domain-of-influence-voting-card-layout.model';
import { DomainOfInfluence } from '../../../../models/domain-of-influence.model';
import { Template } from '../../../../models/template.model';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { groupBySingle } from '../../../../services/utils/array.utils';

export interface Layout {
  layout: DomainOfInfluenceVotingCardLayout;
  hasDomainOfInfluenceLayout: boolean;
  loading: boolean;
}

@Component({
  selector: 'app-manager-voting-card-layout-dialog',
  templateUrl: './manager-voting-card-layout-dialog.component.html',
  styleUrls: ['./manager-voting-card-layout-dialog.component.scss'],
})
export class ManagerVotingCardLayoutDialogComponent implements OnInit {
  public saving = false;

  public readonly domainOfInfluence: DomainOfInfluence;
  public readonly layouts: Layout[];
  public readonly votingCardTypes: VotingCardType[];
  public templates: Template[];

  public previewData?: Uint8Array;
  public previewLoading = false;
  public previewVotingCardType?: VotingCardType;

  private readonly layoutsByVotingCardType: Partial<Record<VotingCardType, DomainOfInfluenceVotingCardLayout>> = {};
  private readonly templatesById: Record<number, Template>;

  constructor(
    private readonly layoutService: DomainOfInfluenceVotingCardLayoutService,
    private readonly dialog: MatDialogRef<ManagerVotingCardLayoutDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: ManagerVotingCardLayoutDialogData,
  ) {
    this.domainOfInfluence = data.layouts.domainOfInfluence;
    this.templates = data.templates;
    this.templatesById = groupBySingle(
      data.templates,
      t => t.id,
      t => t,
    );

    const layouts = Object.values(data.layouts.layouts);
    this.layouts = layouts.map(layout => ({
      layout,
      hasDomainOfInfluenceLayout: layout.domainOfInfluenceTemplate !== undefined,
      loading: false,
    }));
    this.layoutsByVotingCardType = groupBySingle(
      layouts,
      l => l.votingCardType,
      l => l,
    );

    this.ensureTemplatesExists();
    this.previewVotingCardType = this.layouts[0].layout.votingCardType;
    this.votingCardTypes = this.layouts.map(l => l.layout.votingCardType);
  }

  public ngOnInit(): Promise<void> {
    return this.updatePreview();
  }

  public close(): void {
    this.dialog.close();
  }

  public async updateAllowCustom(layout: Layout, allowCustom: boolean): Promise<void> {
    if (layout.layout.allowCustom === allowCustom) {
      return;
    }

    layout.layout.allowCustom = allowCustom;
    await this.updateLayout(layout);
  }

  public async updateHasDoiLayout(layout: Layout, hasDoiLayout: boolean): Promise<void> {
    if (layout.hasDomainOfInfluenceLayout === hasDoiLayout) {
      return;
    }

    layout.hasDomainOfInfluenceLayout = hasDoiLayout;
    if (hasDoiLayout) {
      return;
    }

    layout.layout.effectiveTemplate = layout.layout.contestTemplate;
    if (layout.layout.domainOfInfluenceTemplate === undefined) {
      return;
    }

    delete layout.layout.domainOfInfluenceTemplate;

    await this.updateLayout(layout);
    this.previewVotingCardType = layout.layout.votingCardType;
    await this.updatePreview();
  }

  public async updateDoiTemplate(layout: Layout, templateId: number | string | undefined): Promise<void> {
    if (!templateId) {
      return;
    }

    const templateIdNr = +templateId;
    if (layout.layout.domainOfInfluenceTemplate?.id === templateIdNr) {
      return;
    }

    layout.layout.effectiveTemplate = layout.layout.domainOfInfluenceTemplate = this.templatesById[templateIdNr];
    delete layout.layout.overriddenTemplate;

    await this.updateLayout(layout);
    this.previewVotingCardType = layout.layout.votingCardType;
    await this.updatePreview();
  }

  public async updatePreview(): Promise<void> {
    delete this.previewData;

    if (!this.previewVotingCardType || (this.layoutsByVotingCardType[this.previewVotingCardType]?.effectiveTemplate?.id ?? 0) === 0) {
      return;
    }

    try {
      this.previewLoading = true;
      this.previewData = await this.layoutService.getPdfPreview(this.domainOfInfluence.id, this.previewVotingCardType);
    } finally {
      this.previewLoading = false;
    }
  }

  private async updateLayout(layout: Layout): Promise<void> {
    try {
      layout.loading = true;
      await this.layoutService.setLayout(this.domainOfInfluence.id, layout.layout);
    } finally {
      layout.loading = false;
    }
  }

  private ensureTemplatesExists(): void {
    const templates = [...this.templates];
    for (const { layout } of this.layouts) {
      const id = layout.domainOfInfluenceTemplate?.id ?? 0;
      if (id > 0 && this.templatesById[id] === undefined) {
        templates.push(layout.domainOfInfluenceTemplate!);
        this.templatesById[id] = layout.domainOfInfluenceTemplate!;
      }
    }
    this.templates = templates;
  }
}

export interface ManagerVotingCardLayoutDialogData {
  layouts: DomainOfInfluenceVotingCardLayouts;
  templates: Template[];
}
