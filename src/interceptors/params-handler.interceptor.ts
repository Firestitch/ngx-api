import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor, HttpParams,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash';

import { Observable } from 'rxjs/Observable';

export class ParamsHandlerInterceptor implements HttpInterceptor {
  constructor(private _config: any) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger;
    let params = new HttpParams();

    forEach(this._config.query, function(value, name) {
      params = params.append(name, value);
    });

    const modified = req.clone({
      params: params,
      reportProgress: this._config.reportProgress
    });

    return next.handle(modified);
  }
}
