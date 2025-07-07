
import { merge, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';


import { FsApiConfig, StreamEventComplete } from '../classes';
import { StreamEventData } from '../classes/stream-event-data';
import { StreamEventType } from '../enums';


export class StreamResponseInterceptor implements HttpInterceptor {
  
  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {}
  
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    let idx = 0;

    return next.handle(req)
      .pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          try {
            const error = JSON.parse(errorResponse.error);

            errorResponse = new HttpErrorResponse({
              ...errorResponse,
              error,
            });
          } catch(e) {
            //
          }

          return throwError(() => errorResponse);
        }), 
        filter((event: HttpEvent<any>) => {
          return (
            event?.type === HttpEventType.DownloadProgress ||
            event?.type === HttpEventType.Response
          );
        }),
        switchMap((event: HttpEvent<any>) => {
          if(event.type === HttpEventType.DownloadProgress) {
            let data$;
            const partialText = (event as any).partialText;
                        
            try {
              const text = partialText.substring(idx).trim();
          
              data$ = text.split('\n')
                .map((item) => {
                  const itemData = JSON.parse(item);

                  if(itemData?.code) {
                    if(itemData.code > 200) {
                      return throwError(() => new HttpErrorResponse({
                        status: itemData.code,
                        statusText: itemData.message,
                        error: itemData,
                      }));
                    }
 
                    return of(new StreamEventComplete({ data: itemData, code: itemData.code }));
                    
                  }

                  return of(new StreamEventData({ data: itemData }));
                });

              idx = partialText.length - 1;

            } catch(error) {
              if(!(error instanceof HttpErrorResponse)) {
                return throwError(() =>new HttpErrorResponse({
                  error,
                  status: 400,
                  statusText: partialText,
                }));
              }

              return throwError(() => error);
            } 
          
            return merge(...data$);
          } else if(event.type === HttpEventType.Sent) {
            return of({
              data: [],
              type: StreamEventType.Sent,
            });
          }

          return of({
            data: [],
            type: StreamEventType.Complete,
          });
        }),
      );
  }
}
