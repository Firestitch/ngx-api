
import { concat, EMPTY, merge, Observable, of, throwError } from 'rxjs';
import { catchError, filter, switchMap } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';


import { FsApiConfig, StreamEventComplete } from '../classes';
import { StreamEventData } from '../classes/stream-event-data';
import { DisplayApiError } from '../consts/display-api-error';
import { StreamEventType } from '../enums';


/**
 * Turns a newline-delimited JSON response into a stream of events.
 *
 * The transport detail that shapes this whole class: a DownloadProgress event
 * carries `partialText`, everything received SO FAR, and it fires on network
 * buffer boundaries -- not on newlines. The tail of any given progress event is
 * therefore routinely half a line, and a payload larger than one buffer is
 * guaranteed to arrive split across several events.
 *
 * So only newline-terminated text is safe to parse. Anything after the last
 * newline is incomplete by definition and is left buffered until a later event
 * completes it, or until the response ends and it is known to be whole.
 */
export class StreamResponseInterceptor implements HttpInterceptor {

  constructor(
    protected _config: FsApiConfig,
    protected _data: any,
  ) {}

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

    // How much of the accumulated response text has already been turned into
    // events. Progress events re-send the whole body received so far, so this is
    // a read cursor into it rather than a count of what arrived last.
    let consumed = 0;

    req = req.clone({
      context: req.context.set(DisplayApiError, false),
    });

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
            const partialText = (event as any).partialText ?? '';

            // Everything up to and including the last newline is complete;
            // parsing past it would hand JSON.parse half an object.
            const complete = partialText.lastIndexOf('\n') + 1;

            if(complete <= consumed) {
              return EMPTY;
            }

            const text = partialText.substring(consumed, complete);
            consumed = complete;

            return this._events(text);
          } else if(event.type === HttpEventType.Sent) {
            return of({
              data: [],
              type: StreamEventType.Sent,
            });
          }

          // The response has ended, so whatever follows the last newline is now
          // known to be whole and is parsed here rather than dropped. The final
          // payload is written without a trailing newline, so on a small
          // response this is the ONLY place it is ever seen.
          const body = (event as HttpResponse<any>).body;
          const complete = of({
            data: [],
            type: StreamEventType.Complete,
          });

          if(typeof body !== 'string' || body.length <= consumed) {
            return complete;
          }

          const text = body.substring(consumed);
          consumed = body.length;

          return text.trim()
            ? concat(this._events(text), complete)
            : complete;
        }),
      );
  }

  /**
   * Parse a run of complete newline-delimited lines into their events.
   *
   * A line that fails to parse here is a real protocol error rather than a
   * chunk boundary -- the caller only passes text it knows is terminated.
   */
  private _events(text: string): Observable<any> {
    const lines = text.split('\n')
      .filter((line) => line.trim().length > 0);

    if(!lines.length) {
      return EMPTY;
    }

    let data$;

    try {
      data$ = lines
        .map((line) => {
          const itemData = JSON.parse(line);

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
    } catch(error) {
      if(!(error instanceof HttpErrorResponse)) {
        // The whole body used to go into statusText, which is how a stream
        // error reached the user as pages of JSON. Keep the status text short
        // and hand the offending text over for diagnosis instead.
        //
        // Deliberately NOT under `message`: consumers surface error.error.message
        // to the user in preference to anything else, and a stream that failed to
        // parse is an infrastructure fault nobody can act on. Leaving it unset
        // lets them fall through to their own user-safe wording.
        return throwError(() => new HttpErrorResponse({
          status: 400,
          statusText: 'Invalid stream response',
          error: {
            streamError: 'Invalid stream response',
            text,
          },
        }));
      }

      return throwError(() => error);
    }

    return merge(...data$);
  }
}
