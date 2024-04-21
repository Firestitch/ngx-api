import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpResponse } from '@angular/common/http';

import { RequestMethod, ResponseType } from '../enums';
import { blobToBase64, blobToBase64Url } from '../helpers';
import { FsApiFileConfig } from '../interfaces';
import { FsApi } from '../services';

export class FsApiFile {

  private _url: string;
  private _api: FsApi;
  private _config: FsApiFileConfig;

  constructor(
    api: FsApi, url: string,
    options?: FsApiFileConfig,
  ) {
    this._url = url;
    this._api = api;
    this._config = {
      method: RequestMethod.Get,
      ...options,
    };
  }

  public get blob(): Observable<Blob> {
    return this._api
      .get(this._url, {}, { handlers: false, responseType: ResponseType.Blob });
  }

  public get file(): Observable<File> {
    return this._api
      .request(this._config.method, this._url, this._config.data, {
        handlers: false,
        responseType: ResponseType.Blob,
        mapHttpResponseBody: false,
      })
      .pipe(
        map((event: HttpResponse<any>) => {
          let filename = (event.headers.getAll('Content-Disposition') || [])
            .reduce((accum, item) => {
              const matches = item.match(/filename="([^"]+)"/);

              return matches ? matches[1] : accum;
            }, '');

          if (!filename) {
            const url = new URL(event.url);
            filename = url.pathname.split('/').pop();
          }

          const type = event.headers.get('Content-Type');

          return new File([event.body], filename, { type });
        }),
      );
  }

  public get blobUrl(): Observable<string> {
    return this.blob
      .pipe(
        map((blob) => URL.createObjectURL(blob)),
      );
  }

  public get base64(): Observable<string> {
    return this.blob
      .pipe(
        switchMap((blob) => blobToBase64(blob)),
      );
  }

  public get base64Url(): Observable<string> {
    return this.blob
      .pipe(
        switchMap((blob) => blobToBase64Url(blob)),
      );
  }

  public get safeBase64Url(): Observable<SafeUrl> {
    return this.base64Url
      .pipe(
        map((data) => this._api.sanitizer.bypassSecurityTrustUrl(data)),
      );
  }

  public get safeBase64ResourceUrl(): Observable<SafeResourceUrl> {
    return this.base64Url
      .pipe(
        map((data) => this._api.sanitizer.bypassSecurityTrustResourceUrl(data)),
      );
  }

  public get safeDataUrl(): Observable<SafeUrl> {
    return this.blob
      .pipe(
        map((blob) => URL.createObjectURL(blob)),
        map((data) => this._api.sanitizer.bypassSecurityTrustUrl(data)),
      );
  }

  public download(name?: string): void {
    this.file
      .subscribe((file: File) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = URL.createObjectURL(file);
        name = name ? name : file.name;
        if (name) {
          a.download = name;
        }

        a.click();
        setTimeout(() => {
          URL.revokeObjectURL(a.href);
          a.parentNode.removeChild(a);
        }, 0);
      });
  }
}
