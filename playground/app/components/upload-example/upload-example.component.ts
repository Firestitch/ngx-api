import { Component } from '@angular/core';
import { FsMessage } from '@firestitch/message';
import { FsApi } from '@firestitch/api';
import { HttpEventType, HttpResponse } from '@angular/common/http';


@Component({
  selector: 'upload-example',
  templateUrl: 'upload-example.component.html'
})
export class UploadExampleComponent {

  files = [];
  url = 'https://specify.dev.firestitch.com/api/dummy';
  constructor(private _api: FsApi, private _message: FsMessage) {}

  public upload() {

    const data = { object: { date: new Date() }, file: null };
    this.files.forEach((fsFile, index) => {
      data.file = fsFile.file;

      fsFile.obserable = this._api.post(this.url, data, { reportProgress: true })
      .subscribe(event => {

        switch (event.type) {
          case HttpEventType.Sent: {
            fsFile.progress = true;
            this._message.info('Uploading started');
          } break;
          case HttpEventType.UploadProgress: {
            // const uploaded = (event.loaded / event.total) * 100;
          } break;
          case HttpEventType.ResponseHeader: {
            this._message.info('Response Header Received');
          } break;
          default: {
            this._message.success('Uploading completed');
          }
        }

      }, (err) => {

      }, () => {
        fsFile.progress = false;
      });
    });
  }

  public remove(fsFile) {
    if (fsFile.obserable) {
      fsFile.obserable.unsubscribe();
    }
  }

  public select(files) {
    this.files = this.files.concat(files);
  }
}
