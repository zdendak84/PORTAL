import { AuthenticationService } from '@services/backend-api/users/authentication.service';
import { Component, Input, OnInit } from '@angular/core';
import { ChangePasswordModalComponent } from '@shared/components/change-password-modal/change-password-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';
import { SnackbarService } from '@services/utility/snackbar.service';
import { Store } from '@ngxs/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserDataModel } from "@shared/model/backend-api/userDataModel";

@UntilDestroy()
@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  @Input() loggedUser: UserDataModel;
  loading: boolean;

  constructor(
    private authService: AuthenticationService,
    private store: Store,
    public dialog: MatDialog,
    private snackbarService: SnackbarService) {}

  get userNameWithTitle(): string {
    return `${this.loggedUser.titleBefore ? this.loggedUser.titleBefore : ''} ${this.loggedUser.firstName} ${this.loggedUser.lastName} ${this.loggedUser.titleAfter ? this.loggedUser.titleAfter : ''}`;
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
}
