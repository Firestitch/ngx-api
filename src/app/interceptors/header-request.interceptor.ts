import { Observable } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { FsApiConfig } from '../classes';
import { lookupBlob } from '../helpers/lookup-blob';


export class HeaderRequestInterceptor implements HttpInterceptor {
  
  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let headers = req.headers;

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

    return next.handle(req.clone({ headers }));
  }
}
