import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from '../../../src';

import { FsMessage } from '@firestitch/message';
import { Injector } from '@angular/core';


export class AlertInterceptor extends RequestInterceptor {
  private _message: FsMessage;

  constructor(public config, public data, private _injector: Injector) {
    super(config, data);

    this._message = _injector.get(FsMessage);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    alert('Has been intercepted');
    this._message.info('Has been intercepted');
    return next.handle(req);
  }
}
