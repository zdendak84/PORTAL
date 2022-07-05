import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutes } from './app.routes';
import { AuthGuard } from '@shared/guards/auth.guard';

import { LoginComponent } from './screens/login/login.component';

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
    path: AppRoutes.ADMIN_SECTION,
    loadChildren: () =>
      import('./features/admin-page/admin-page.module').then(
        m => m.AdminPageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.SERVICE,
    loadChildren: () =>
      import('./features/service-page/service-page.module').then(
        m => m.ServicePageModule
      ),
    canActivate: [AuthGuard]
  },
  {
    path: AppRoutes.LOGIN,
    component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
