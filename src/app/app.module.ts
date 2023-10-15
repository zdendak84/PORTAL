import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsRouterPluginModule } from '@ngxs/router-plugin';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@shared/shared.module';
import { APIInterceptor } from '@services/interceptors/http.interceptor';
import { environment } from '../environments/environment';
import { AppState } from '@store/app.state';
import { LoginComponent } from './screens/login/login.component';
import { JwtInterceptor } from '@services/interceptors/jwt.interceptor';
import { NavBarComponent } from './screens/nav-bar/nav-bar.component';
import { NgIdleModule } from '@ng-idle/core';
import { MaterialModule } from '@shared/material.module';
import { CarePlanComponent } from "./screens/carePlan/carePlan.component";

@NgModule({
  declarations: [
    AppComponent, LoginComponent, NavBarComponent, CarePlanComponent
  ],
  imports: [
    NgxsModule.forRoot([AppState], {developmentMode: !environment.production}),
    NgxsRouterPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
    NgIdleModule.forRoot(),
    SharedModule,
    MaterialModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
  { provide: HTTP_INTERCEPTORS, useClass: APIInterceptor, multi: true },
  { provide: 'BASE_API_URL', useValue: environment.apiUrl },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
