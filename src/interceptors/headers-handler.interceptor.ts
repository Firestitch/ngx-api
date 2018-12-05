import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { RequestInterceptor } from './base';
import { lookupBlob } from '../helpers';


export class HeadersHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: any, protected _data: any) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();

    forEach(this._config.headers, function(value, name) {
      headers = headers.set(name, value);
    });

    if (lookupBlob(this._data)) {
      this._config.encoding = 'formdata';
    }

    switch (this._config.encoding) {
      case 'url': {
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      } break;

      case 'json': {
        headers = headers.set('Content-Type', 'text/json');
      } break;

      case 'formdata': {
        headers = headers.delete('Content-Type');
      } break;
    }

    const modified = req.clone({ headers: headers });

    return next.handle(modified);
  }
}
