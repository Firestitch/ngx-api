import { RequestInterceptor, makeInterceptorFactory } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';


class AlertInterceptor extends RequestInterceptor {
  constructor(public config, public data, public fsMessage: FsMessage) {
    super(config, data);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.fsMessage.info('Interceptor had been ran');

    return next.handle(req);
  }
}


export const AlertInterceptorFactory = makeInterceptorFactory(AlertInterceptor);
