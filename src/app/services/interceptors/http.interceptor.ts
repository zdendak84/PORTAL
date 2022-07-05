import { Inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '@services/backend-api/users/authentication.service';
import { errorCodeMap } from '@shared/constants/errorCodeMap.constants';

@Injectable({
  providedIn: 'root'
})
export class APIInterceptor implements HttpInterceptor {
  constructor(@Inject('BASE_API_URL') private baseUrl: string, private authService: AuthenticationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const apiReq = req.clone({ url: this.baseUrl + req.url });
    return next.handle(apiReq).pipe(catchError(err => {
      if (err.status === 401) {
        this.authService.logout();
        location.reload();
      }
      const error = err.error.errorMessage || err.error.message;
      return throwError(errorCodeMap.get(error) ? errorCodeMap.get(error) : error);
    }));
  }
}
