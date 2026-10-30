import { throwError } from 'rxjs';

import { HttpErrorResponse, HttpHandler, HttpRequest } from '@angular/common/http';

import { FsApiConfig } from '../classes';
import { ResponseType } from '../enums';

import { BodyResponseInterceptor } from './body-response.interceptor';


describe('BodyResponseInterceptor', () => {

  const payload = { data: [], code: 400, message: 'Chrome produced no PDF output' };

  // The error the transport hands over for a given error body, run through the
  // interceptor, resolved to the HttpErrorResponse the consumer receives.
  function interceptError(errorBody: any, responseType: ResponseType): Promise<HttpErrorResponse> {
    const config = new FsApiConfig({ responseType }, 'GET', {});
    const interceptor = new BodyResponseInterceptor(config, {});
    const request = new HttpRequest('GET', 'agreementversions/1/download', { responseType });
    const handler: HttpHandler = {
      handle: () => throwError(() => new HttpErrorResponse({
        error: errorBody,
        status: 400,
        statusText: 'OK',
        url: 'agreementversions/1/download',
      })),
    };

    return new Promise((resolve, reject) => {
      interceptor.intercept(request, handler)
        .subscribe({
          next: () => reject(new Error('expected the request to error')),
          error: (error: HttpErrorResponse) => resolve(error),
        });
    });
  }

  describe('error body reaches the consumer as the server payload whatever the response type', () => {

    it('decodes an ArrayBuffer error body from an arraybuffer request', async () => {
      const body = new TextEncoder().encode(JSON.stringify(payload)).buffer;

      const error = await interceptError(body, ResponseType.ArrayBuffer);

      expect(error.error).toEqual(payload);
      expect(error.error.message).toBe(payload.message);
      expect(error.status).toBe(400);
    });

    it('decodes a Blob error body from a blob request', async () => {
      const body = new Blob([JSON.stringify(payload)], { type: 'application/json' });

      const error = await interceptError(body, ResponseType.Blob);

      expect(error.error).toEqual(payload);
    });

    it('parses a string error body from a text request', async () => {
      const error = await interceptError(JSON.stringify(payload), ResponseType.Text);

      expect(error.error).toEqual(payload);
    });

    it('leaves an already parsed object error body alone', async () => {
      const error = await interceptError(payload, ResponseType.Json);

      expect(error.error).toBe(payload);
    });

    it('falls back to the raw text when an ArrayBuffer error body is not json', async () => {
      const body = new TextEncoder().encode('<html>Bad Gateway</html>').buffer;

      const error = await interceptError(body, ResponseType.ArrayBuffer);

      expect(error.error).toBe('<html>Bad Gateway</html>');
    });
  });
});
