import { Component } from '@angular/core';
import { FsApi, ResponseType } from '@firestitch/api';

@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent {

  data: Array<any> = null;
  file: null;
  url = 'https://specify.dev.firestitch.com/api/dummy';
  constructor(private _api: FsApi) {}

  uploadFiles(file: File) {
    this._api.post(this.url, { file: file })
    .subscribe(resp => {
    });
  }

  public post() {
    const data = { object: { date: new Date() } };
    this._api.post(this.url, data)
    .subscribe(resp => {
      this.data = resp;
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

    this._api.get(this.url, query, { key: 'objects', cache: cache })
    .subscribe(resp => {

      console.log(resp);
      this.data = resp;
    }, (event) => {
      //this.data = event.error;
    });
  }

  public blob() {
    const url = this.url + '/download';
    this._api.get(url, {}, {
      interceptors: false,
      handlers: false,
      responseType: ResponseType.Blob
    })
    .subscribe(resp => {
      console.log(resp);
      this.data = resp;
    }, (event) => {
      alert(event)
    });
  }
}
