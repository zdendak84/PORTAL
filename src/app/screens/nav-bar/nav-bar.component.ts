import { Component, Input, OnInit } from '@angular/core';
import { UserDataModel } from '@shared/model/backend-api/userDataModel';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import moment from 'moment';

import { AuthenticationService } from '@services/backend-api/users/authentication.service';
import { AuthorizeService } from '@services/backend-api/users/authorize.service';
import { AdminPageRoutes } from '../../features/admin-page/admin-page.routes';
import { UserService } from '@services/backend-api/users/user.service';
import { ServicePageRoutes } from '../../features/service-page/service-page.routes';
import { ChangePasswordModalComponent } from '@shared/components/change-password-modal/change-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { SnackbarService } from '@services/utility/snackbar.service';

@UntilDestroy()
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Input() loggedUser: UserDataModel;
  actualDate = moment();
  loading: boolean;
  servicePageRoutes = ServicePageRoutes;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private authorizeService: AuthorizeService,
    private store: Store,
    public dialog: MatDialog,
    private snackbarService: SnackbarService) {}

  get userNameWithTitle(): string {
    return `${this.loggedUser.firstName} ${this.loggedUser.lastName}`;
  }

  ngOnInit(): void {
  }

  logoutUser(): void {
    this.authService.logout();
  }

  changePassword(): void {
    let dialog;
    dialog = this.dialog.open(ChangePasswordModalComponent, {
      disableClose: true,
      width: '400px'
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.event === ModalEventEnum.Edit) {
        this.snackbarService.openInfoSnackBar('Heslo bylo změněno.');
      }
    });
  }

  private navigateTo(url: string): void {
    this.store.dispatch(new Navigate([url]));
  }
}
