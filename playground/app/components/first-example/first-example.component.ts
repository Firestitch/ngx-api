import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';

import { FsApi, ResponseType } from '@firestitch/api';

@Component({
  selector: 'first-example',
  templateUrl: './first-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FirstExampleComponent {

  public data: any[] = null;
  public file: null;
  public url = 'https://specify.dev.firestitch.com/api/dummy';

  constructor(
    private _api: FsApi,
    private _cdRef: ChangeDetectorRef,
  ) {}

  public uploadFiles(file: File) {
    this._api.post(this.url, { file })
      .subscribe((resp) => {
      });
  }

  public post() {
    const data = {
      string: 'Hello',
      number: 5674325,
      date: new Date(),
      array: [1,2,3],
      arrayObject: [{ id: 1 }, { id: 2 }],
      object: { date: new Date() },
    };

    this._api
      .post(this.url, data)
      .subscribe((resp) => {
        this.data = resp;
        this._cdRef.markForCheck();
      });
  }

  public getException() {
    this.get({ exception: '400 Exception Message' });
  }

  public get(query, cache = false) {
    query.nullValue = null;
    query.objectValue = { name: 'Name', value: 999, childObject: { id: 555 } };
    query.arrayObjects = [{ name: 'Element 1', value: 1 }, { name: 'Element 2', value: 2 }];
    query.arrayStrings = ['active', 'pending'];
    query.date = { date: new Date() };

    this._api.get(this.url, query, { key: 'objects', cache })
      .subscribe((resp) => {

        console.log(resp);
        this.data = resp;
        this._cdRef.markForCheck();
      });
  }

  public blob() {
    const url = `${this.url  }/download`;
    this._api.get(url, {}, {
      interceptors: false,
      handlers: false,
      responseType: ResponseType.Blob,
    })
      .subscribe((resp) => {
        console.log(resp);
        this.data = resp;
        this._cdRef.markForCheck();
      }, (event) => {
        alert(event);
      });
  }
}
