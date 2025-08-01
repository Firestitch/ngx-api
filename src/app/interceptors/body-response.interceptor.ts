import { parse, parseLocal } from '@firestitch/date';

import { Observable, of, throwError } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';


import { FsApiConfig } from '../classes';
import { ResponseType } from '../enums';


export class BodyResponseInterceptor implements HttpInterceptor {

  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req)
      .pipe(
        filter((event: HttpEvent<any>) => {
          return this._config.reportProgress || event instanceof HttpResponse;
        }),
        switchMap((event: HttpResponse<any>) => {
          if(event instanceof HttpResponse) {
            if(event.body?.code > 200) {
              const error = new HttpErrorResponse({
                status: event.body.code,
                statusText: event.body.message,
                error: event.body,
                headers: event.headers,
                url: event.url,
              });
    
              return throwError(error);
            }

            if((this._config.mapHttpResponseBody ?? true)) {
              let response = event.body; 

              if(this._config.responseType === ResponseType.Json) {
                if ((this._config.mapHttpResponseBodyData ?? true)) {
                  response = response.data;
                }  

                if (this._config.key && event.body?.data) {
                  response = response[this._config.key];
                } 
                
                response = this._processData(response);
              }    

              return of(response);
            }
          }
          
          return of(event);
        }),
      );
  }

  private _processData(data): void {
    if (data instanceof Object) {
      for (const key of Object.keys(data)) {
        data[key] = this._processData(data[key]);
      }
    } else {
      if(typeof data === 'string') {
        const matchDate = data
          .match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}([+-]\d{2}:\d{2}|\.\d{3}Z)?$/);

        if(matchDate) {
          data = matchDate[1] ? parse(data) : parseLocal(data);
        } else {
          const matchTime = data.match(/^\d{2}:\d{2}:\d{2}$/);

          if(matchTime) {
            data = parseLocal(data);
          }
        }
      }
    }

    return data;
  }
}
