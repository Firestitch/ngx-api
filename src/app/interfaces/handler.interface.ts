import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';

import { FsApiConfig } from '../classes';


export interface FsApiBaseHander {
  success(event?: HttpResponse<any>, config?: FsApiConfig, request?: HttpRequest<any>);
  error(error?: HttpErrorResponse, config?: FsApiConfig);
  complete(config?: FsApiConfig);
}
