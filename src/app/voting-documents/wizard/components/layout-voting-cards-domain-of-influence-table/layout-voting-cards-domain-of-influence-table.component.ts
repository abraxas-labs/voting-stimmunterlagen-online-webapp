/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { VotingCardType } from '@abraxas/voting-stimmunterlagen-proto';
import { Component, Input } from '@angular/core';
import { Contest } from '../../../../models/contest.model';
import { DomainOfInfluenceVotingCardLayouts } from '../../../../models/domain-of-influence-voting-card-layout.model';
import { Template } from '../../../../models/template.model';
import { DialogService } from '../../../../services/dialog.service';
import { distinct, flatten } from '../../../../services/utils/array.utils';
import {
  ManagerVotingCardLayoutDialogComponent,
  ManagerVotingCardLayoutDialogData,
} from '../../dialogs/manager-voting-card-layout-dialog/manager-voting-card-layout-dialog.component';

@Component({
  selector: 'app-layout-voting-cards-domain-of-influence-table',
  templateUrl: './layout-voting-cards-domain-of-influence-table.component.html',
  styleUrls: ['./layout-voting-cards-domain-of-influence-table.component.scss'],
})
export class LayoutVotingCardsDomainOfInfluenceTableComponent {
  public readonly colNameDoi = 'doiName';
  public readonly colNameVotingCardTemplateSuffix = 'Template';
  public readonly colNameVotingCardAllowCustomSuffix = 'AllowCustom';

  @Input()
  public readonly = true;

  @Input()
  public templates: Template[] = [];

  @Input()
  public contest!: Contest;

  public layoutGroups: DomainOfInfluenceVotingCardLayouts[] = [];
  public columns: string[] = [];
  public votingCardTypes: VotingCardType[] = [];

  constructor(private readonly dialogService: DialogService) {}

  @Input()
  public set layouts(layouts: DomainOfInfluenceVotingCardLayouts[]) {
    this.layoutGroups = layouts;
    this.votingCardTypes = distinct(flatten(layouts.map(l => Object.keys(l.layouts)))).map(x => +x as VotingCardType);
    this.columns = [
      this.colNameDoi,
      ...flatten(
        this.votingCardTypes.map(vct => [vct + this.colNameVotingCardTemplateSuffix, vct + this.colNameVotingCardAllowCustomSuffix]),
      ),
    ];
  }

  public edit(row: DomainOfInfluenceVotingCardLayouts): void {
    if (this.readonly) {
      return;
    }

    this.dialogService.open(
      ManagerVotingCardLayoutDialogComponent,
      {
        templates: this.templates,
        layouts: row,
      } as ManagerVotingCardLayoutDialogData,
      {
        minWidth: '70vw',
        minHeight: '80vh',
      },
    );
  }

  public isSelectionDisabled = (row: DomainOfInfluenceVotingCardLayouts): boolean => {
    return this.readonly;
  };
}
