import { HttpParams } from '@angular/common/http';

export class HttpUtils {
  static convertToParams(request: any): HttpParams {
    let params: HttpParams = new HttpParams();
    if (request) {
      Object.keys(request).forEach(key => {
        // tslint:disable-next-line:triple-equals
        if (request[key] != null || undefined) {
          params = params.set(key, request[key]);
        }
      });
    }
    return params;
  }
}
