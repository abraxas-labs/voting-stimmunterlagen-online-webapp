/**
 * (c) Copyright by Abraxas Informatik AG
 *
 * For license information see LICENSE file.
 */

import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { SelectRoleDialogComponent } from '../../dialog/select-role-dialog/select-role-dialog.component';
import { Router } from '@angular/router';
import { RoleService } from '../../../services/role.service';
import { Roles } from '../../../models/roles.model';
import { ThemeService } from '@abraxas/voting-lib';

@Component({
  selector: 'app-redirect-by-role-page',
  templateUrl: './redirect-by-role-page.component.html',
  styleUrls: ['./redirect-by-role-page.component.scss'],
})
export class RedirectByRolePageComponent implements OnInit {
  constructor(
    private readonly dialog: DialogService,
    private readonly router: Router,
    private readonly roleService: RoleService,
    private readonly themeService: ThemeService,
  ) {}

  public async ngOnInit(): Promise<void> {
    const isElectionAdmin = await this.roleService.isElectionAdmin();
    const isPrintJobManager = await this.roleService.isPrintJobManager();

    if (!isElectionAdmin && !isPrintJobManager) {
      return;
    }

    if (isElectionAdmin && isPrintJobManager) {
      const result = await this.dialog.openForResult(SelectRoleDialogComponent, [Roles.ElectionAdmin, Roles.PrintJobManager]);
      return this.navigateToApp(result === Roles.PrintJobManager);
    }

    return this.navigateToApp(isPrintJobManager);
  }

  private navigateToApp(isPrintJobManager: boolean): Promise<void> {
    return isPrintJobManager ? this.navigateToPrintJobManagement() : this.navigateToVotingDocuments();
  }

  private async navigateToVotingDocuments(): Promise<void> {
    await this.router.navigate([this.themeService.theme$.value, 'voting-documents']);
  }

  private async navigateToPrintJobManagement(): Promise<void> {
    await this.router.navigate([this.themeService.theme$.value, 'print-job-management']);
  }
}
