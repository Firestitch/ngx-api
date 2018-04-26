import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import { RequestInterceptor } from '../../../src';


export class AlertInterceptor extends RequestInterceptor {
  constructor(protected _config, protected _data) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    alert('Has been intercepted');
    return next.handle(req);
  }
}
