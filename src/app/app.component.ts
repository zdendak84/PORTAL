import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { AppState } from '@store/app.state';
import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {SetExaminations, SetLocations, SetWorkplaces, SetListingFilter, SetCodeBooks} from '@store/app.actions';
import { environment } from '../environments/environment';
import { AuthenticationService } from '@services/backend-api/users/authentication.service';
import { UserDataModel } from "@shared/model/backend-api/userDataModel";
import { CodebookService } from "@services/backend-api/codebook/codebook.service";
import { forkJoin } from "rxjs";

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  userData: UserDataModel;
  constructor(
    private authenticationService: AuthenticationService,
    private codeBookService: CodebookService,
    private idle: Idle,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.store.select(AppState.userBasicData).pipe(untilDestroyed(this)).subscribe(userData => {
      if (userData) {
        this.userData = userData.user;
        const examinations$ = this.codeBookService.getExaminations();
        const locations$ = this.codeBookService.getLocations();
        const workplaces$ = this.codeBookService.getWorkplaces();
        const codebooks$ = this.codeBookService.getCodeBooks();
        forkJoin([examinations$, locations$, workplaces$, codebooks$]).subscribe(result => {
          if (result) {
            this.store.dispatch(new SetExaminations(result[0]));
            this.store.dispatch(new SetLocations(result[1]));
            this.store.dispatch(new SetWorkplaces(result[2]));
            this.store.dispatch(new SetCodeBooks(result[3]));

            const filter = {
              locationId: result[1]?.length === 1 ? result[1][0].locationId : null,
              workplaceId: result[2]?.length === 1 ? result[2][0].workplaceId : null,
              dateFrom: null
            };
            this.store.dispatch(new SetListingFilter(filter));
          }
        });
      } else {
        this.userData = null;
      }
    });
    this.idle.setIdle(environment.idleTime * 720);
    this.idle.setTimeout(false);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleStart.subscribe(() => {
      this.authenticationService.logout();
    });
    this.idle.watch();
  }
}
