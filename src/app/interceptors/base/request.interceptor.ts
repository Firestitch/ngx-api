import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash-es';
import { Observable } from 'rxjs';


export class RequestInterceptor implements HttpInterceptor {
  constructor(protected _config: any, protected _data: any) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req);
  }
}
