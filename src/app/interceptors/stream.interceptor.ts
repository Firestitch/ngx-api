
import { merge, Observable, of, throwError } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

import {
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';


import { FsApiConfig, StreamEventComplete } from '../classes';
import { StreamEventData } from '../classes/stream-event-data';
import { StreamEventType } from '../enums';


export class StreamInterceptor implements HttpInterceptor {
  
  constructor(
    protected _config: FsApiConfig, 
    protected _data: any,
  ) {}
  
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    let idx = 0;

    return next.handle(req)
      .pipe(
        filter((event: HttpEvent<any>) => {
          return (
            event?.type === HttpEventType.DownloadProgress ||
            event?.type === HttpEventType.Response
          );
        }),
        switchMap((event: HttpEvent<any>) => {
          if(event.type === HttpEventType.DownloadProgress) {
            let data$;
            try {
              const partialText = (event as any).partialText;
              const text = partialText.substring(idx).trim();
          
              data$ = text.split('\n')
                .map((item) => {
                  const itemData = JSON.parse(item);

                  if(itemData?.code) {
                    if(itemData > 200) {
                      throw new HttpErrorResponse({
                        status: itemData.code,
                        statusText: itemData.message,
                        error: itemData,
                      });
                    } else {
                      return of(new StreamEventComplete({ data: itemData, code: itemData.code }));
                    }
                  }

                  return of(new StreamEventData({ data: itemData }));
                });

              idx = partialText.length - 1;

            } catch(error) {
              if(!(error instanceof HttpErrorResponse)) {
                return throwError(new HttpErrorResponse({
                  status: 400,
                  statusText: error,
                }));
              }

              return throwError(error);
            } 
          
            return merge(...data$);
          } 

          return of({
            data: [],
            type: StreamEventType.Complete,
          });
        }),
      );
  }
}
