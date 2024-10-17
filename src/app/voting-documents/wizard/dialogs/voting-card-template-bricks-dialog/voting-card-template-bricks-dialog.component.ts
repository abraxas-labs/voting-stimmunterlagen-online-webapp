/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TemplateBrick } from '../../../../models/template.model';
import { DialogService } from '../../../../services/dialog.service';
import { DomainOfInfluenceVotingCardBrickService } from '../../../../services/domain-of-influence-voting-card-brick.service';
import {
  VotingCardTemplateBrickEditDialogComponent,
  VotingCardTemplateBrickEditDialogData,
} from '../voting-card-template-brick-edit-dialog/voting-card-template-brick-edit-dialog.component';

@Component({
  selector: 'app-voting-card-template-bricks-dialog',
  templateUrl: './voting-card-template-bricks-dialog.component.html',
  styleUrls: ['./voting-card-template-bricks-dialog.component.scss'],
})
export class VotingCardTemplateBricksDialogComponent implements OnInit {
  public loading = true;
  public saving = false;
  public bricks: TemplateBrick[] = [];
  private hasChanges: boolean = false;

  private readonly templateId: number;

  constructor(
    private readonly brickService: DomainOfInfluenceVotingCardBrickService,
    private readonly dialog: MatDialogRef<VotingCardTemplateBricksDialogComponent>,
    private readonly dialogService: DialogService,
    @Inject(MAT_DIALOG_DATA) data: VotingCardTemplateBricksDialogData,
  ) {
    this.templateId = data.templateId;
  }

  public async ngOnInit(): Promise<void> {
    try {
      this.bricks = await this.brickService.list(this.templateId);
    } finally {
      this.loading = false;
    }
  }

  public async editBrick(brick: TemplateBrick): Promise<void> {
    const dialogData: VotingCardTemplateBrickEditDialogData = {
      brick,
    };

    const changedData = await this.dialogService.openForResult(VotingCardTemplateBrickEditDialogComponent, dialogData);
    this.hasChanges = this.hasChanges || changedData;
  }

  public close(): void {
    this.dialog.close(this.hasChanges);
  }
}

export interface VotingCardTemplateBricksDialogData {
  templateId: number;
}
