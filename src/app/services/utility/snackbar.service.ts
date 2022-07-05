import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackBarComponent } from '@shared/components/snack-bar/snack-bar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  snackBarInfoDuration = 2;
  snackBarErrorDuration = 4;

  constructor(private snackBar: MatSnackBar) {}

  openInfoSnackBar(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {message, warning: false, color: '#ffff00'}, duration: this.snackBarInfoDuration * 1000,
    });
  }

  openErrorSnackBar(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {message, warning: true, color: '#ffff00'}, duration: this.snackBarErrorDuration * 1000,
    });
  }

  openInfoPlanningBar(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {message, warning: false, color: '#00ff00'}, duration: this.snackBarInfoDuration * 1000,
    });
  }

  openErrorPlanningBar(message: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: {message, warning: true, color: '#ff0000'}, duration: this.snackBarInfoDuration * 1000,
    });
  }
}
