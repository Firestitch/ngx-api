
import { Observable } from 'rxjs';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from '@angular/common/http';


import { FsApiConfig } from '../classes';
import { CustomParamsEncoder } from '../classes/params-encoder';
import { objectToFormData } from '../helpers/object-to-form-data';


export class ParamRequestInterceptor implements HttpInterceptor {
  
  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {}
  
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let params = new HttpParams({
      encoder: new CustomParamsEncoder(),
    });

    const formData: FormData = objectToFormData(this._config.query);
    formData.forEach((value: any, name) => {
      params = params.append(name, value);
    });

    const modified = req.clone({
      params,
      reportProgress: this._config.reportProgress,
    });

    return next.handle(modified);
  }
}
