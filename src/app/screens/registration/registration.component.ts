import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { AppRoutes } from '../../app.routes';
import { MustMatch } from "@shared/validators/must-match.validator";
import { AccountService } from "@services/backend-api/users/account.service";
import { YesNoModalComponent } from "@shared/components/yes-no-modal/yes-no-modal.component";
import { UntilDestroy, untilDestroyed } from "@ngneat/until-destroy";
import { MatDialog } from "@angular/material/dialog";
import { ResultDataModel } from "@shared/model/backend-api/resultDataModel";
import { SnackbarService } from "@services/utility/snackbar.service";
import { AuthenticationService } from "@services/backend-api/users/authentication.service";

@UntilDestroy()
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css'],
})
export class RegistrationComponent implements OnInit {
  readonly emailTaken = 'Tento email již nelze zaregistrovat';
  readonly emailMatch = 'Emailové adresy se neshodují';
  readonly passwordMatch = 'Hesla se neshodují';
  activationForm: UntypedFormGroup;
  loginForm: UntypedFormGroup;
  personalForm: UntypedFormGroup;
  validationResult: ResultDataModel;
  submitted = false;

  constructor(
    public dialog: MatDialog,
    private accountService: AccountService,
    private authService: AuthenticationService,
    private fb: UntypedFormBuilder,
    private snackbarService: SnackbarService,
    private store: Store) {}

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get emailConfirm(): AbstractControl {
    return this.loginForm.get('emailConfirm');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  get passwordConfirm(): AbstractControl {
    return this.loginForm.get('passwordConfirm');
  }

  get code(): AbstractControl {
    return this.activationForm.get('code');
  }

  ngOnInit(): void {
    this.createActivationForm();
    this.createLoginForm();
    this.createPersonalForm();
  }

  onActivate(): void {
    if (this.activationForm.invalid) {
      return;
    }
    this.accountService.activateAccount(this.validationResult.result, this.code.value).subscribe(result => {
      if (result?.result === 1) {
        this.authService.login({email: this.email.value, password: this.password.value}).subscribe(() => {
          this.afterLoginNavigation();
        }, () => {
          this.snackbarService.openErrorSnackBar('Přihlášení selhalo');
        });
      } else {
        this.snackbarService.openErrorSnackBar('Aktivace nebyla úspěšná, zkontrolujte kód a zkuste jej zadat znovu');
      }
    });
  }

  onCancel(): void {
    const dialog = this.dialog.open(YesNoModalComponent, {
      disableClose: true, data: {
        body: '',
        header: 'Opravdu chcete proces registrace opustit?'
      }
    });
    dialog.afterClosed().pipe(untilDestroyed(this)).subscribe(result => {
      if (result.result) {
        this.store.dispatch(new Navigate([AppRoutes.LOGIN]));
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.personalForm.invalid) {
      return;
    }
    const account = {...this.loginForm.value, ...this.personalForm.value}
    this.submitted = true;
    this.accountService.createAccount(account).subscribe(result => {
      this.validationResult = result;
    });
  }

  checkAccountAvailability(): void {
    if (!this.email.hasError('email') && !this.email.hasError('required')) {
      const email = this.email.value;
      this.accountService.checkAccountAvailability(email).subscribe(available => {
        if (!available) {
          this.email.setErrors({unavailable: true});
        }  else {
          this.email.setErrors(null);
        }
      });
    }
  }

  private afterLoginNavigation(): void {
    this.store.dispatch(new Navigate([AppRoutes.HOME]));
  }

  private createActivationForm(): void {
    this.activationForm = this.fb.group({
      code: [null, Validators.required],
      gdpr: [1, Validators.required]
    });
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      emailConfirm: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required],
      passwordConfirm: [null, Validators.required]
    }, {
      validators: [
        MustMatch('email', 'emailConfirm'),
        MustMatch('password', 'passwordConfirm')
      ]
    });
  }

  private createPersonalForm(): void {
    this.personalForm = this.fb.group({
      insuranceNumber: [null, Validators.required],
      personalIdentificationNumber: [null, Validators.required],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: [null, Validators.required]
    });
  }
}
