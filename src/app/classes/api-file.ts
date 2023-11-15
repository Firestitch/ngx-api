import { SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { HttpResponse } from '@angular/common/http';

import { ResponseType } from '../enums';
import { FsApi } from '../services';


export class FsApiFile {

  private _url: string;
  private _api: FsApi;
  private _name: string;

  constructor(api: FsApi, url: string, filename?: string) {
    this._url = url;
    this._api = api;
    this._name = filename;

    if (!this._name) {
      this._name = (url || '').replace(/\?.*/, '');
      this._name = this._name.substring(this._name.lastIndexOf('/') + 1);
    }
  }

  public get name(): string {
    return this._name;
  }

  public get blob(): Observable<Blob> {
    return this._api
      .get(this._url, {}, { handlers: false, responseType: ResponseType.Blob });
  }

  public get file(): Observable<File> {
    return this._api
      .get(this._url, {}, {
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

          return new File([event.body], filename);
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
        switchMap((blob) => new Observable<string>((observer) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onload = () => {
            observer.next(reader.result as string);
            observer.complete();
          };
          reader.onerror = (error) => observer.error(error);
        }),
        ),
      );
  }

  public get safeBase64Url(): Observable<SafeUrl> {
    return this.base64
      .pipe(
        map((data) => this._api.sanitizer.bypassSecurityTrustUrl(data)),
      );
  }


  public get safeBase64ResourceUrl(): Observable<SafeResourceUrl> {
    return this.base64
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
      });
  }
}
