import { parse, parseLocal } from '@firestitch/date';

import { from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';


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
        catchError((errorResponse: HttpErrorResponse) => {
          return this._errorResponse(errorResponse);
        }),
        filter((event: HttpEvent<any>) => {
          return this._config.reportProgress || event instanceof HttpResponse;
        }),
        switchMap((event: HttpResponse<any>) => {
          if(event instanceof HttpResponse) {
            return this._envelope(event)
              .pipe(
                switchMap((envelope) => this._response(event, envelope)),
              );
          }

          return of(event);
        }),
      );
  }

  private _response(event: HttpResponse<any>, envelope: any): Observable<any> {
    if(this._isErrorCode(envelope?.code)) {
      const error = new HttpErrorResponse({
        status: envelope.code,
        statusText: envelope.message,
        error: envelope,
        headers: event.headers,
        url: event.url,
      });

      return throwError(() => error);
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

    return of(event);
  }

  /**
   * The payload the code check reads. Usually just the parsed body, but a blob
   * request (file/download) hands back an undecoded Blob, hiding the code from
   * the check below. Only a json content type is decoded — reading a real
   * pdf/csv/image download into a string to look for a code it will never have
   * is both wasteful and a good way to break a legitimate download.
   *
   * The body itself is deliberately left alone: file() runs with
   * mapHttpResponseBody false and needs event.body to still be a Blob to build
   * its File.
   */
  private _envelope(event: HttpResponse<any>): Observable<any> {
    if(event.body instanceof Blob && this._isJson(event.headers)) {
      return from(event.body.text())
        .pipe(
          map((text) => this._parseJson(text)),
        );
    }

    return of(event.body);
  }

  /**
   * An error body arrives in whatever shape the transport chose rather than the
   * shape the server sent: a Blob for a blob request, a string when it could not
   * be parsed. Decode it back to the payload so consumers read one shape — an
   * undecoded Blob reaches FsErrorMessage as Blob.prototype.text, which renders
   * as "function text() { [native code] }" in place of the server's message.
   *
   * Unlike the success path this does not check the content type: an error body
   * is always the payload, never the file that was asked for.
   */
  private _errorResponse(errorResponse: HttpErrorResponse): Observable<never> {
    return this._errorBody(errorResponse.error)
      .pipe(
        switchMap((error) => throwError(() => new HttpErrorResponse({
          error,
          status: errorResponse.status,
          statusText: errorResponse.statusText,
          headers: errorResponse.headers,
          url: errorResponse.url ?? undefined,
        }))),
      );
  }

  private _errorBody(error: any): Observable<any> {
    if(error instanceof Blob) {
      return from(error.text())
        .pipe(
          map((text) => this._parseJson(text)),
        );
    }

    if(typeof error === 'string') {
      return of(this._parseJson(error));
    }

    return of(error);
  }

  /**
   * Success is the whole 2xx range — 201/202/204 are successes, not failures.
   * Anything else the envelope reports is an error, a code under 200 included.
   * A body carrying no code is not an envelope (a plain file, a bare value) and
   * never throws on its own.
   */
  private _isErrorCode(code: any): boolean {
    if(code === null || code === undefined) {
      return false;
    }

    const value = Number(code);

    return Number.isFinite(value) && (value < 200 || value >= 300);
  }

  private _isJson(headers: HttpHeaders): boolean {
    return (headers?.get('Content-Type') || '')
      .includes('application/json');
  }

  /**
   * Falls back to the raw text when the body is not json — a gateway error page,
   * a truncated response — so those degrade to an unreadable-but-present message
   * instead of throwing in the error handler.
   */
  private _parseJson(text: string): any {
    try {
      return JSON.parse(text);
    } catch(e) {
      return text;
    }
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
