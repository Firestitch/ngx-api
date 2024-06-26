import { Observable } from 'rxjs';

import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
} from '@angular/common/http';

import { FsApiConfig } from '../classes';
import { lookupBlob } from '../helpers/lookup-blob';

import { RequestInterceptor } from './base/request.interceptor';


export class HeadersHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: FsApiConfig, protected _data: any) {
    super(_config, _data);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = new HttpHeaders();

    Object.keys(this._config.headers)
      .forEach((name) => {
        headers = headers.set(name, this._config.headers[name]);
      });

    if (lookupBlob(this._data)) {
      this._config.encoding = 'formdata';
    }

    switch (this._config.encoding) {
      case 'url': {
        headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
      } break;

      case 'json': {
        headers = headers.set('Content-Type', 'application/json');
      } break;

      case 'formdata': {
        headers = headers.delete('Content-Type');
      } break;
    }

    const modified = req.clone({ headers });

    return next.handle(modified);
  }
}
