import {
  HttpEvent,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { RequestInterceptor } from './base';
import { objectToFormData } from '../helpers';


export class BodyHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: any, protected _data: any) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let body = null;

    switch (this._config.encoding) {
      case 'url': {
        body = this._data;
      } break;

      case 'json': {
        body = JSON.stringify(this._data);
      } break;

      case 'formdata': {
        body = objectToFormData(this._data);
      } break;
    }

    const modified = req.clone({
      body: body
    });

    return next.handle(modified);
  }
}
