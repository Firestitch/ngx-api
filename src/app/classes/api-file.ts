import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';


import { RequestMethod, ResponseType } from '../enums';
import { blobToBase64, blobToBase64Url } from '../helpers';
import { FsApiFileConfig } from '../interfaces';
import { FsApi } from '../services';


export class FsApiFile {

  private _url: string;
  private _api: FsApi;
  private _config: FsApiFileConfig;

  constructor(
    api: FsApi,
    url: string | (string|number)[],
    options?: FsApiFileConfig,
  ) {
    this._url = Array.isArray(url) ? url.join('/') : url;
    this._api = api;
    this._config = {
      method: RequestMethod.Get,
      ...options,
    };
  }

  public get name(): string {
    return this._config.name;
  }

  public get blob(): Observable<Blob> {
    return this._api
      .get(this._url, {}, { handlers: false, responseType: ResponseType.Blob });
  }

  public get file(): Observable<File> {
    return this._api.file(this._config.method, this._url, this._config.data);
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
    this._api.download(name, this._config.method, this._url, this._config.data);
  }
}
