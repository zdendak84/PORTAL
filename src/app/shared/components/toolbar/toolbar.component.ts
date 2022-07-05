import { Component, EventEmitter, Input, Output } from '@angular/core';
import { timer } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent {
  errorMessage: string;
  @Input()
  mainTitle = '';

  @Output()
  readonly errorDismissEmitter: EventEmitter<boolean> = new EventEmitter();

  @Input()
  set errorMsg(message: string) {
    this.errorMessage = message ? message : null;
    this.dismissError(5);
  }

  dismissError(duration: number): void {
    if (this.errorMessage) {
      timer(duration * 1000).pipe(untilDestroyed(this)).subscribe(() => {
        this.errorMessage = null;
        this.errorDismissEmitter.emit(true);
      });
    }
  }
}
