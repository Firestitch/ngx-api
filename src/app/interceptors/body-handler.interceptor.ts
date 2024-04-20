import { Observable } from 'rxjs';

import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';


import { FsApiConfig } from '../classes';
import { objectToFormData } from '../helpers/object-to-form-data';

import { RequestInterceptor } from './base/request.interceptor';


export class BodyHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: FsApiConfig, protected _data: any) {
    super(_config, _data);
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let body = this._data;

    switch (this._config.encoding) {
      // case 'json': {
      //   body = JSON.stringify(this._data);
      // } break;

      case 'formdata': {
        body = objectToFormData(this._data);
      } break;
    }

    return next.handle(req.clone({ body }));
  }
}
