import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash';

import { Observable } from 'rxjs/Observable';

export class HeadersHandlerInterceptor implements HttpInterceptor {
  constructor(private _config: any) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    debugger;
    let headers = new HttpHeaders();

    forEach(this._config.headers, function(value, name) {
      headers = headers.set(name, value);
    });


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
