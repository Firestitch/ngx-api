import {
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import * as forEach from 'lodash/forEach';

import { RequestInterceptor } from './base';


export class BodyHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: any, protected _data: any) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (lookupBlob(this._data)) {
      this._config.encoding = 'formdata';
    }

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

export function lookupBlob(data: {}, level = 0) {
  level++;

  // Depth limit
  if (level >= 4 || !data) {
    return false;
  }

  return Object.keys(data).some((key) => {
    const item = data[key];

    if (item instanceof Blob) {
      return true;
    } else if (item instanceof Object || Array.isArray(item)) {
      return lookupBlob(item, level);
    }
  });
}
