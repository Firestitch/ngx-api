import {
  HttpEvent,
  HttpHandler,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

import { forEach } from 'lodash-es';
import { Observable } from 'rxjs';
import { RequestInterceptor } from './base/request.interceptor';
import { CustomParamsEncoder } from '../classes/params-encoder';


export class ParamsHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: any, protected _data: any) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = new HttpParams({
      encoder: new CustomParamsEncoder()
    });

    forEach(this._config.query, function(value, name) {
      params = params.append(name, value);
    });

    const modified = req.clone({
      params: params,
      reportProgress: this._config.reportProgress
    });

    return next.handle(modified);
  }
}
