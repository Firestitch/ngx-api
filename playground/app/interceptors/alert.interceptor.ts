import { BaseInterceptor } from '../../../src/interceptors/base.interceptor';
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';


export class AlertInterceptor extends BaseInterceptor {
  constructor(protected _config, protected _data) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    alert('Has been intercepted');
    return next.handle(req);
  }
}
