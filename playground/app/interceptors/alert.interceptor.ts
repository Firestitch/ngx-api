import { makeInterceptorFactory } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


class AlertInterceptor implements HttpInterceptor {

  constructor(
    public config, 
    public data, 
    public fsMessage: FsMessage,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.fsMessage.info('Interceptor had been ran');

    return next.handle(req);
  }
}

export const AlertInterceptorFactory = makeInterceptorFactory(AlertInterceptor);
