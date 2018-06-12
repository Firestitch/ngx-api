import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from '../../../src';
import { FsMessage } from '@firestitch/message';
import { makeInterceptorFactory } from '../../../src/helpers';


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
