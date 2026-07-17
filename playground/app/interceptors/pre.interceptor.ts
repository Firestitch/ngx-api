import { makeInterceptorFactory } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


class PreInterceptor implements HttpInterceptor {

  constructor(
    public config,
    public data,
    public message: FsMessage,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          this.message.error(errorResponse.error?.message ?? errorResponse.message);

          return throwError(() => errorResponse);
        }),
      );
  }
}

export const PreInterceptorFactory = makeInterceptorFactory(PreInterceptor);
