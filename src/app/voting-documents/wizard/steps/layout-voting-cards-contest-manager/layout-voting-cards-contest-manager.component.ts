/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, inject } from '@angular/core';
import { ContestVotingCardLayout } from '../../../../models/contest-voting-card-layout.model';
import { Step } from '../../../../models/step.model';
import { Template } from '../../../../models/template.model';
import { ContestVotingCardLayoutService } from '../../../../services/contest-voting-card-layout.service';
import { groupBySingle } from '../../../../services/utils/array.utils';
import { StepBaseComponent } from '../step-base.component';
import { VotingCardLayoutDataConfiguration } from '../../../../models/voting-card-layout.model';
import { equalsVotingCardLayoutDataConfiguration } from '../../../../models/domain-of-influence-voting-card-layout.model';

interface Layout {
  layout: ContestVotingCardLayout;
  loading: boolean;
}

@Component({
  selector: 'app-layout-voting-cards-contest-manager',
  templateUrl: './layout-voting-cards-contest-manager.component.html',
  styleUrls: ['./layout-voting-cards-contest-manager.component.scss'],
  standalone: false,
})
export class LayoutVotingCardsContestManagerComponent extends StepBaseComponent {
  private readonly layoutVotingCardsService = inject(ContestVotingCardLayoutService);

  public templates: Template[] = [];
  public layouts: Layout[] = [];
  public votingCardTypes: VotingCardType[] = [];
  public previewData?: Uint8Array;
  public previewLoading = false;
  public allTemplatesSet = false;
  public previewVotingCardType?: VotingCardType;

  private layoutsByVotingCardType: Partial<Record<VotingCardType, ContestVotingCardLayout>> = {};
  private templatesById: Record<number, Template> = {};

  constructor() {
    super(Step.STEP_LAYOUT_VOTING_CARDS_CONTEST_MANAGER);
  }

  public async updateTemplate(layout: Layout, newTemplateId: string | number | undefined): Promise<void> {
    if (!this.canEdit || !newTemplateId) {
      return;
    }

    const newTemplateIdNr = +newTemplateId;
    if (layout.layout.template?.id === newTemplateIdNr) {
      return;
    }

    layout.layout.template = this.templatesById[newTemplateIdNr];

    await this.updateLayout(layout);
    this.previewVotingCardType = layout.layout.votingCardType;
    await this.updatePreview();
  }

  public updateAllowCustom(layout: Layout, allowCustom: boolean): Promise<void> {
    if (layout.layout.allowCustom === allowCustom) {
      return Promise.resolve();
    }

    layout.layout.allowCustom = allowCustom;
    return this.updateLayout(layout);
  }

  public async updateDataConfiguration(layout: Layout, dataConfiguration: VotingCardLayoutDataConfiguration): Promise<void> {
    if (equalsVotingCardLayoutDataConfiguration(dataConfiguration, layout.layout.dataConfiguration)) {
      return;
    }

    layout.layout.dataConfiguration = dataConfiguration;
    await this.updateLayout(layout);
    await this.updatePreview();
  }

  public async updatePreview(): Promise<void> {
    delete this.previewData;

    if (
      !this.stepInfo ||
      !this.previewVotingCardType ||
      (this.layoutsByVotingCardType[this.previewVotingCardType]?.template?.id ?? 0) === 0
    ) {
      return;
    }

    try {
      this.previewLoading = true;
      this.previewData = await this.layoutVotingCardsService.getPdfPreview(this.stepInfo.contest.id, this.previewVotingCardType);
    } finally {
      this.previewLoading = false;
    }
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    const [layouts, templates] = await Promise.all([
      this.layoutVotingCardsService.getLayouts(this.stepInfo.contest.id),
      this.layoutVotingCardsService.getTemplates(this.stepInfo.contest.id),
    ]);

    this.templates = templates;
    this.templatesById = groupBySingle(
      templates,
      t => t.id,
      t => t,
    );
    this.layouts = layouts.map(layout => ({
      loading: false,
      layout,
    }));
    this.layoutsByVotingCardType = groupBySingle(
      layouts,
      l => l.votingCardType,
      l => l,
    );
    this.updateAllTemplatesSet();
    this.ensureTemplatesExists();
    this.votingCardTypes = layouts.map(l => l.votingCardType);
    this.previewVotingCardType = layouts.find(l => l.template?.id ?? 0 > 0)?.votingCardType;

    this.updatePreview();
  }

  private async updateLayout(layout: Layout): Promise<void> {
    if (!this.stepInfo || !this.canEdit || layout.layout.template === undefined) {
      return;
    }

    try {
      layout.loading = true;
      await this.layoutVotingCardsService.setLayout(this.stepInfo.contest.id, layout.layout);
    } finally {
      layout.loading = false;
    }
    this.updateAllTemplatesSet();
  }

  private ensureTemplatesExists(): void {
    const templates = [...this.templates];
    for (const { layout } of this.layouts) {
      const id = layout.template?.id ?? 0;
      if (id > 0 && this.templatesById[id] === undefined) {
        templates.push(layout.template!);
        this.templatesById[id] = layout.template!;
      }
    }
    this.templates = templates;
  }

  private updateAllTemplatesSet(): void {
    this.allTemplatesSet = this.layouts.every(l => l.layout.template?.id ?? 0 > 0);
  }
}
