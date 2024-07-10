import { FsApiConfig, makeInterceptorFactory } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';

import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


class AlertInterceptor implements HttpInterceptor {

  constructor(
    public config: FsApiConfig, 
    public data, 
    public message: FsMessage,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.message.info('Interceptor had been ran');

    return next.handle(req);
  }
}

export const AlertInterceptorFactory = makeInterceptorFactory(AlertInterceptor);
