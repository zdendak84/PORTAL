import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@services/backend-api/users/authentication.service';
import { Component, OnInit } from '@angular/core';
import { DeviceUtils } from "@shared/utils/device-utils";
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
    public device: DeviceUtils,
    private authService: AuthenticationService,
    private fb: UntypedFormBuilder,
    private snackbarService: SnackbarService) {}

  get userName(): AbstractControl {
    return this.loginForm.get('userName');
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
    this.authService.login({userName: this.userName.value, password: this.password.value}).subscribe(() => {}, () => {
      this.snackbarService.openErrorSnackBar('Přihlášení selhalo');
      this.loading = false;
    });
  }

  private createLoginForm(): void {
    this.loginForm = this.fb.group({
      userName: [null, Validators.required],
      password: [null, Validators.required]
    });
  }
}
