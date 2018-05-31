import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from '../../../src';
import { FsMessage } from '@firestitch/message';
import { Injector } from '@angular/core';


export class AlertInterceptor extends RequestInterceptor {
  private fsMessage: FsMessage;

  constructor(public config, public data, private injector: Injector) {
    super(config, data);
    this.fsMessage = injector.get(FsMessage);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.fsMessage.info('Has been intercepted');
    return next.handle(req);
  }
}
