

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  HttpEvent, HttpHandler, HttpRequest,
} from '@angular/common/http';


export class HttpInterceptor implements HttpInterceptor {

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(
        tap(() => {
          console.log('Tap HttpInterceptor');
        }),
      );
  }
}
