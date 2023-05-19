import { Observable } from "rxjs";

import { FsApi } from "../services";
import { ResponseType } from "../enums";
import { map } from "rxjs/operators";


export class FsApiFile {

  private _url: string;
  private _api: FsApi;
  private _name: string;

  public constructor(api: FsApi, url: string, filename?: string) {
    this._url = url;
    this._api = api;
    this._name = filename;
    
    if(!this._name) {
      this._name = (url || '').replace(/\?.*/, '');
      this._name.substring(this._name.lastIndexOf('/') + 1);
    }
  }
  
  public get name(): string {
    return this._name;
  }

  public get blob(): Observable<Blob> {
    return this._api
      .get(this._url, {}, { handlers: false, responseType: ResponseType.Blob });
  }

  public get dataUrl(): Observable<string> {
    return this.blob
      .pipe(
        map((blob) => URL.createObjectURL(blob))
      );
  }

  public download(name?: string): void {
    this.dataUrl
      .subscribe((objectUrl) => {
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style.display = 'none';
        a.href = objectUrl;
        a.download = name ? name : this._name;
        a.click();
      });
  }
}