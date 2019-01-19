import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { RequestInterceptor, makeInterceptorFactory } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';
import { Observable } from 'rxjs';


class AlertInterceptor extends RequestInterceptor {
  constructor(public config, public data, public fsMessage: FsMessage) {
    super(config, data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.fsMessage.info('Has been intercepted');
    return next.handle(req);
  }
}


export const AlertInterceptorFactory = makeInterceptorFactory(AlertInterceptor);
