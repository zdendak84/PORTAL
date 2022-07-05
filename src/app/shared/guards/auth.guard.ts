import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';

import { AppRoutes } from '../../app.routes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private store: Store) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (sessionStorage.getItem('account')) {
      const loggedUser = JSON.parse(sessionStorage.getItem('account'));
      return true;
    }
    this.store.dispatch(new Navigate([AppRoutes.LOGIN]));
    return false;
  }
}
