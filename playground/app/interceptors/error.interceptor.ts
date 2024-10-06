import { Injector } from '@angular/core';

import {
  DisplayApiError, FsApiConfig,
  makeInterceptorFactory,
} from '@firestitch/api';
import { FsErrorMessage } from '@firestitch/message';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


class ErrorInterceptor implements HttpInterceptor {

  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
    protected _injector: Injector,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((event: HttpErrorResponse) => {
          if (this._config.context?.get(DisplayApiError) ?? true) {
            this._injector.get(FsErrorMessage).processHttpErrorResponse(event);
          }

          return throwError(event);
        }),
      );
  }
}

export const ErrorInterceptorFactory = makeInterceptorFactory(ErrorInterceptor);
