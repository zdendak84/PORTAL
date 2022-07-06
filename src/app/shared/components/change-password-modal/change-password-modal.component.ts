import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { MustMatch } from '@shared/validators/must-match.validator';
import { AppState } from '@store/app.state';
import { AccountService } from '@services/backend-api/users/account.service';
import { SnackbarService } from '@services/utility/snackbar.service';
import { AccountStateDataModel } from '@shared/model/state/account-state-data.model';
import { MatDialogRef } from '@angular/material/dialog';
import { ModalEventEnum } from '@shared/model/enums/modalEventEnum';

@UntilDestroy()
@Component({
  selector: 'app-user-page',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.css'],
})
export class ChangePasswordModalComponent implements OnInit {
  readonly fieldRequired = 'Toto pole je povinné';
  readonly passwordMatch = 'Hesla nejsou stejná';
  @Select(AppState.accountBasicData) account$: Observable<AccountStateDataModel>;
  passwordChangeForm: UntypedFormGroup;
  accountId: number;
  hide = true;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>,
    private fb: UntypedFormBuilder,
    private store: Store,
    private snackBarService: SnackbarService,
    private userService: AccountService) {}

  get oldPassword(): AbstractControl {
    return this.passwordChangeForm.get('oldPassword');
  }

  get newPassword(): AbstractControl {
    return this.passwordChangeForm.get('newPassword');
  }

  get confirmNewPassword(): AbstractControl {
    return this.passwordChangeForm.get('confirmNewPassword');
  }

  ngOnInit(): void {
    this.account$.pipe(untilDestroyed(this)).subscribe(accountBasicData => {
      this.accountId = accountBasicData.account.accountId;
    });
    this.createPasswordChangeForm();
  }

  onSubmit(): void {
    if (this.passwordChangeForm.invalid) {
      return;
    }
    this.userService.changeUserPassword({
      accountId: this.accountId,
      oldPassword: this.oldPassword.value,
      newPassword: this.newPassword.value
    }).subscribe(() => {
      this.dialogRef.close({event: ModalEventEnum.Edit});
    }, error => {
      if (error === 'PASSWORD_DONT_MATCH') {
        this.snackBarService.openErrorSnackBar('Stávají heslo je špatné!');
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close({event: ModalEventEnum.Cancel});
  }

  private createPasswordChangeForm(): void {
    this.passwordChangeForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmNewPassword')
    });
  }
}
