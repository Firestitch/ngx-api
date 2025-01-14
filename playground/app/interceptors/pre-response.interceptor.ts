
import {
  FsApiConfig,
  makeInterceptorFactory,
} from '@firestitch/api';

import { Observable, tap } from 'rxjs';

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


class PreResponseInterceptory implements HttpInterceptor {

  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap((event) => {
          //
        }),
      );
  }
}

export const PreResponseInterceptorFactory = makeInterceptorFactory(PreResponseInterceptory);
