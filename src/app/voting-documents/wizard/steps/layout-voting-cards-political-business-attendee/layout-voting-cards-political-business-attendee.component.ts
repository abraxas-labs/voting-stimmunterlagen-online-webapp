/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, inject } from '@angular/core';
import {
  DomainOfInfluenceVotingCardLayout,
  equalsVotingCardLayoutDataConfiguration,
} from '../../../../models/domain-of-influence-voting-card-layout.model';
import { Step } from '../../../../models/step.model';
import { Template } from '../../../../models/template.model';
import { DialogService } from '../../../../services/dialog.service';
import { DomainOfInfluenceVotingCardLayoutService } from '../../../../services/domain-of-influence-voting-card-layout.service';
import { groupBySingle } from '../../../../services/utils/array.utils';
import {
  VotingCardTemplateBricksDialogComponent,
  VotingCardTemplateBricksDialogData,
} from '../../dialogs/voting-card-template-bricks-dialog/voting-card-template-bricks-dialog.component';
import { StepBaseComponent } from '../step-base.component';
import { VotingCardLayoutDataConfiguration } from '../../../../models/voting-card-layout.model';

interface Layout {
  layout: DomainOfInfluenceVotingCardLayout;
  hasOverriddenLayout: boolean;
  loading: boolean;
}

@Component({
  selector: 'app-layout-voting-cards-political-business-attendee',
  templateUrl: './layout-voting-cards-political-business-attendee.component.html',
  styleUrls: ['./layout-voting-cards-political-business-attendee.component.scss'],
  standalone: false,
})
export class LayoutVotingCardsPoliticalBusinessAttendeeComponent extends StepBaseComponent {
  private readonly dialog = inject(DialogService);
  private readonly layoutVotingCardsService = inject(DomainOfInfluenceVotingCardLayoutService);

  public templates: Template[] = [];
  public layouts: Layout[] = [];
  public votingCardTypes: VotingCardType[] = [];
  public loadingAnyLayout = false;
  public previewData?: Uint8Array;
  public previewLoading = false;

  public previewVotingCardType?: VotingCardType;

  private layoutsByVotingCardType: Partial<Record<VotingCardType, DomainOfInfluenceVotingCardLayout>> = {};
  private templatesById: Record<number, Template> = {};

  constructor() {
    super(Step.STEP_LAYOUT_VOTING_CARDS_POLITICAL_BUSINESS_ATTENDEE);
  }

  public async updateHasOverriddenLayout(layout: Layout, hasOverriddenLayout: boolean): Promise<void> {
    if (layout.hasOverriddenLayout === hasOverriddenLayout) {
      return;
    }

    layout.hasOverriddenLayout = hasOverriddenLayout;
    if (hasOverriddenLayout) {
      return;
    }

    layout.layout.effectiveTemplate = layout.layout.domainOfInfluenceTemplate ?? layout.layout.contestTemplate;
    if (layout.layout.overriddenTemplate === undefined) {
      return;
    }

    delete layout.layout.overriddenTemplate;

    await this.updateLayout(layout);
    this.previewVotingCardType = layout.layout.votingCardType;
    await this.updatePreview();
  }

  public async updateOverriddenTemplate(layout: Layout, templateId: number | string | undefined): Promise<void> {
    if (!templateId) {
      return;
    }

    const templateIdNr = +templateId;
    if (layout.layout.overriddenTemplate?.id === templateIdNr) {
      return;
    }

    layout.layout.effectiveTemplate = layout.layout.overriddenTemplate = this.templatesById[templateIdNr];

    await this.updateLayout(layout);
    this.previewVotingCardType = layout.layout.votingCardType;
    await this.updatePreview();
  }

  public async updateDataConfiguration(layout: Layout, dataConfiguration: VotingCardLayoutDataConfiguration): Promise<void> {
    if (equalsVotingCardLayoutDataConfiguration(dataConfiguration, layout.layout.dataConfiguration)) {
      return;
    }

    layout.layout.dataConfiguration = dataConfiguration;
    await this.updateLayout(layout);
    await this.updatePreview();
  }

  public async editTemplateData(): Promise<void> {
    if (!this.stepInfo || !this.previewVotingCardType) {
      return;
    }

    const dialogData: VotingCardTemplateBricksDialogData = {
      templateId: this.layoutsByVotingCardType[this.previewVotingCardType]!.effectiveTemplate.id,
    };

    const updated = await this.dialog.openForResult(VotingCardTemplateBricksDialogComponent, dialogData);
    if (updated) {
      await this.updatePreview();
    }
  }

  public async updatePreview(): Promise<void> {
    delete this.previewData;

    if (
      !this.stepInfo ||
      !this.previewVotingCardType ||
      (this.layoutsByVotingCardType[this.previewVotingCardType]?.effectiveTemplate?.id ?? 0) === 0
    ) {
      return;
    }

    try {
      this.previewLoading = true;
      this.previewData = await this.layoutVotingCardsService.getPdfPreview(this.stepInfo.domainOfInfluence.id, this.previewVotingCardType);
    } finally {
      this.previewLoading = false;
    }
  }

  protected async loadData(): Promise<void> {
    if (!this.stepInfo) {
      return;
    }

    const [layouts, templates] = await Promise.all([
      this.layoutVotingCardsService.getLayouts(this.stepInfo.domainOfInfluence.id),
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
      hasOverriddenLayout: layout.overriddenTemplate !== undefined,
      layout,
    }));
    this.layoutsByVotingCardType = groupBySingle(
      layouts,
      l => l.votingCardType,
      l => l,
    );
    this.ensureTemplatesExists();
    this.votingCardTypes = layouts.map(l => l.votingCardType);
    this.previewVotingCardType = layouts.find(l => l.effectiveTemplate?.id ?? 0 > 0)?.votingCardType;

    this.updatePreview();
  }

  private async updateLayout(layout: Layout): Promise<void> {
    if (!this.stepInfo || !this.canEdit || layout.layout.effectiveTemplate === undefined) {
      return;
    }

    try {
      layout.loading = true;
      this.loadingAnyLayout = true;
      await this.layoutVotingCardsService.setOverriddenLayout(this.stepInfo.domainOfInfluence.id, layout.layout);
    } finally {
      layout.loading = false;
      this.loadingAnyLayout = false;
    }
  }

  private ensureTemplatesExists(): void {
    const templates = [...this.templates];
    for (const { layout } of this.layouts) {
      const id = layout.overriddenTemplate?.id ?? 0;
      if (id > 0 && this.templatesById[id] === undefined) {
        templates.push(layout.overriddenTemplate!);
        this.templatesById[id] = layout.overriddenTemplate!;
      }
    }
    this.templates = templates;
  }
}
