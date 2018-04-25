import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash';

import { Observable } from 'rxjs/Observable';

export class RequestReadyInterceptor implements HttpInterceptor {
  constructor(private _cb: any) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this._cb();
    return next.handle(req);
  }
}
