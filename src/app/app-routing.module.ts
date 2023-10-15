import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app.routes';
import { AuthGuard } from '@shared/guards/auth.guard';

import { LoginComponent } from './screens/login/login.component';
import { CarePlanComponent } from "./screens/carePlan/carePlan.component";

const routes: Routes = [
  {
    path: AppRoutes.HOME,
    loadChildren: () =>
      import('./features/home-page/home-page.module').then(
        m => m.HomePageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent
  },
  {
    path: AppRoutes.CARE_PLAN,
    component: CarePlanComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
