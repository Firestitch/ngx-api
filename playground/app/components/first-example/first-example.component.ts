import { Component } from '@angular/core';
import { FsApi, ResponseType } from '@firestitch/api';

@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent {

  data: Array<any> = null;
  file: null;
  url = 'https://boilerplate.local.firestitch.com/api/dummy';
  constructor(private FsApi: FsApi) {}

  uploadFiles(file: File) {

    console.log(file);
    this.FsApi.post(this.url, { file: file })
    .subscribe(resp => {
    });
  }

  public post() {

    const data = { object: { date: new Date() } };

    this.FsApi.post(this.url, data)
    .subscribe(resp => {
      this.data = resp;
    });
  }

  public getException() {
    this.get({ exception: '400 Exception Message' });
  }

  public get(query) {
    this.FsApi.get(this.url, query, { key: 'objects' })
    .subscribe(resp => {

      console.log(resp);
      this.data = resp;
    }, (event) => {
      //this.data = event.error;
    });
  }

  public blob() {
    const url = this.url + '/download';
    this.FsApi.get(url, {}, {
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


  public mapp(resp) {
    return { data: resp.data.objects };
  }
}
