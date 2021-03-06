import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { AuthenticationService } from '@services/backend-api/users/authentication.service';
import { AppRoutes } from '../../app.routes';
import { SnackbarService } from '@services/utility/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loading: boolean;
  loginForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private store: Store,
    private snackbarService: SnackbarService,
    private authService: AuthenticationService) {}

  get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.createLoginForm();
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login({email: this.email.value, password: this.password.value}).subscribe(() => {
      this.loading = false;
      this.afterLoginNavigation();
    }, () => {
      this.snackbarService.openErrorSnackBar('Přihlášení selhalo');
      this.loading = false;
    });
  }

  registrationNavigation(): void {
    this.store.dispatch(new Navigate([AppRoutes.REGISTRATION]));
  }

  private afterLoginNavigation(): void {
    this.store.dispatch(new Navigate([AppRoutes.HOME]));
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      password: [null, Validators.required]
    });
  }
}
