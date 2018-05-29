import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from '../../../src';
import { Optional, Inject } from '@angular/core';

import { FsMessageModule, FsMessage } from '@firestitch/message';


export class AlertInterceptor extends RequestInterceptor {
  constructor(public config, public data, @Optional() @Inject(FsMessage) private fsMessage) {
    super(config, data);
    debugger;
    console.log(config,data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    alert('Has been intercepted');
    return next.handle(req);
  }
}
