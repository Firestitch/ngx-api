import {
  HttpRequest, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import { RequestConfig } from './request-config.interface';

export interface FsApiBaseHander {
  success(event?: HttpResponse<any>, config?: RequestConfig, request?: HttpRequest<any>);
  error(error?: HttpErrorResponse, config?: RequestConfig);
  complete(config?: RequestConfig);
}
