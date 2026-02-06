/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from '../../../../../environments/environment';
import { TemplateBrick } from '../../../../models/template.model';
import { DomainOfInfluenceVotingCardBrickService } from '../../../../services/domain-of-influence-voting-card-brick.service';
import { ToastService } from '../../../../services/toast.service';

const dmDocEventListenerKey = 'message';
const dmDocContentEmitFunction = 'getEditorContent';

@Component({
  selector: 'app-voting-card-template-brick-edit-dialog',
  templateUrl: './voting-card-template-brick-edit-dialog.component.html',
  styleUrls: ['./voting-card-template-brick-edit-dialog.component.scss'],
  standalone: false,
})
export class VotingCardTemplateBrickEditDialogComponent implements OnInit, OnDestroy {
  private readonly brickService = inject(DomainOfInfluenceVotingCardBrickService);
  private readonly dialog = inject<MatDialogRef<VotingCardTemplateBrickEditDialogComponent>>(MatDialogRef);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly toast = inject(ToastService);

  public loading = true;
  public saving = false;
  public brick!: TemplateBrick;
  public brickEditSrc?: SafeUrl;

  private readonly boundDmDocEditorEventHandler: (e: any) => Promise<void>;

  @ViewChild('editorIframe')
  public editorIframe?: ElementRef;

  constructor() {
    const data = inject<VotingCardTemplateBrickEditDialogData>(MAT_DIALOG_DATA);

    this.brick = data.brick;
    this.boundDmDocEditorEventHandler = this.dmDocEditorEventHandler.bind(this);
  }

  public async ngOnInit(): Promise<void> {
    // the dmDoc editor iframe sends the editor content to the parent window, when the parent requests it by passing
    // a message to the iframe with the properties { dmDocFunction: 'getEditorContent' }.
    window.addEventListener(dmDocEventListenerKey, this.boundDmDocEditorEventHandler);

    try {
      const brickEditUrl = environment.dmDocBaseUrl + (await this.brickService.getContentEditorUrl(this.brick));
      // By default, Angular does not allow using URL values in templates. But since we need to pass an URL to the iframe tag,
      // we are forced to bypass this Angular security mechanism.
      this.brickEditSrc = this.sanitizer.bypassSecurityTrustResourceUrl(brickEditUrl);
    } finally {
      this.loading = false;
    }
  }

  public ngOnDestroy(): void {
    window.removeEventListener(dmDocEventListenerKey, this.boundDmDocEditorEventHandler);
  }

  public async save(): Promise<void> {
    if (!this.editorIframe) {
      this.close();
      return;
    }

    this.editorIframe.nativeElement.contentWindow.postMessage(this.buildDmDocMessage(), '*');
  }

  public close(): void {
    this.dialog.close();
  }

  private async dmDocEditorEventHandler(e: any): Promise<void> {
    if (!e || !e.data || !e.data.response || !e.data.response.editorContent) {
      return;
    }

    try {
      this.saving = true;
      const response = await this.brickService.updateContent(this.brick.contentId, e.data.response.editorContent);
      this.brick.id = response.newBrickId;
      this.brick.contentId = response.newContentId;
      this.toast.saved();
      this.dialog.close(true);
      window.removeEventListener(dmDocEventListenerKey, this.boundDmDocEditorEventHandler);
    } finally {
      this.saving = false;
    }
  }

  private buildDmDocMessage(): DocumatrixMessage {
    return {
      requestId: Date.now().toString(),
      dmDocFunction: dmDocContentEmitFunction,
    };
  }
}

export interface VotingCardTemplateBrickEditDialogData {
  brick: TemplateBrick;
}

interface DocumatrixMessage {
  requestId: string;
  dmDocFunction: string;
}
