import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '@store/app.state';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

import { UserDataModel } from '@shared/model/backend-api/userDataModel';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '../environments/environment';
import { AuthenticationService } from '@services/backend-api/users/authentication.service';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userData: UserDataModel;
  constructor(
    private store: Store,
    private authenticationService: AuthenticationService,
    private idle: Idle,
  ) {}

  ngOnInit(): void {
    this.store.select(AppState.userBasicData).pipe(untilDestroyed(this)).subscribe(userData => {
      if (userData) {
        this.userData = userData.user;
      } else {
        this.userData = null;
      }
    });
    this.idle.setIdle(environment.idleTime * 60);
    this.idle.setTimeout(false);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleStart.subscribe(() => {
      this.authenticationService.logout();
    });
    this.idle.watch();
  }
}
