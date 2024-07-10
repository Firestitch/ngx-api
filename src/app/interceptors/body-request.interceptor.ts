
import { Observable } from 'rxjs';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';


import { FsApiConfig } from '../classes';
import { objectToFormData } from '../helpers/object-to-form-data';


export class BodyRequestInterceptor implements HttpInterceptor {

  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let body = this._data;
    if(this._config.encoding === 'formdata') {
      body = objectToFormData(body);
    }

    req = req.clone({ body });

    return next.handle(req);
  }
}
