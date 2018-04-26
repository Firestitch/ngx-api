import {
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { BaseInterceptor } from './base.interceptor';


export class BodyHandlerInterceptor extends BaseInterceptor {
  constructor(protected _config: any, protected _data: any) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let hasFile = false;

    forEach(this._data, (item) => {
      if (item instanceof Blob) {
        hasFile = true;
        this._config.encoding = 'formdata';
      }
    });

    let body = null;

    switch (this._config.encoding) {
      case 'url': {
        body = this._data;
      } break;

      case 'json': {
        body = JSON.stringify(this._data);
      } break;

      case 'formdata': {
        body = new FormData();
        forEach(this._data, function(item, key) {
          if (item != null && item.name) {
            body.append(key, item, item.name);
          } else {
            body.append(key, item);
          }
        });
      } break;
    }

    const modified = req.clone({
      body: body
    });

    return next.handle(modified);
  }
}
