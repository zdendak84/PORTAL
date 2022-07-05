import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Store } from '@ngxs/store';
import { AppState } from '@store/app.state';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userDetails = this.store.selectSnapshot(AppState.accountBasicData);
    if (userDetails && userDetails.jwt) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${userDetails.jwt}`
        }
      });
    }
    return next.handle(request);
  }
}
