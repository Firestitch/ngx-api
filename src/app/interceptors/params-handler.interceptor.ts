import {
  HttpEvent,
  HttpHandler,
  HttpParams,
  HttpRequest
} from '@angular/common/http';

import { Observable } from 'rxjs';
import { RequestInterceptor } from './base/request.interceptor';
import { CustomParamsEncoder } from '../classes/params-encoder';
import { objectToFormData } from '../helpers/object-to-form-data';


export class ParamsHandlerInterceptor extends RequestInterceptor {
  constructor(protected _config: any, protected _data: any) {
    super(_config, _data);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = new HttpParams({
      encoder: new CustomParamsEncoder()
    });

    const formData: FormData = objectToFormData(this._config.query);
    formData.forEach((value: any, name) => {
      params = params.append(name, value);
    });

    const modified = req.clone({
      params: params,
      reportProgress: this._config.reportProgress
    });

    return next.handle(modified);
  }
}
