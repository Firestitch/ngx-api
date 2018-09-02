import { Component } from '@angular/core';
import { FsApi } from '../../../../src';

@Component({
  selector: 'first-example',
  templateUrl: 'first-example.component.html'
})
export class FirstExampleComponent {

  data: Array<any> = null;
  file: null;
  url = 'https://components.firestitch.com/api/dummy';
  constructor(private FsApi: FsApi) {}

  uploadFiles(file: File) {

    console.log(file);
    this.FsApi.post(this.url, { file: file })
    .subscribe(resp => {
    });
  }

  public post() {

    const data = { moment: null, object: { date: new Date() } };

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

  public mapp(resp) {
    return { data: resp.data.objects };
  }
}
