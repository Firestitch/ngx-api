import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { FsMessage } from '@firestitch/message';
import { FsApi } from '@firestitch/api';


@Component({
  selector: 'upload-cancel-example',
  templateUrl: 'upload-cancel-example.component.html'
})
export class UploadCancelExampleComponent {

  files = [];
  url = 'https://components.firestitch.com/api/dummy';
  constructor(private _api: FsApi, private _message: FsMessage) {}

  public upload() {

    const data = { moment: null, object: { date: new Date() }, file: null };
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
            const uploaded = (event.loaded / event.total) * 100;
            this._message.info(`Uploading ${uploaded.toFixed(1)}%`);
          } break;
          case HttpEventType.ResponseHeader: {
            this._message.info('Response Header Received');
          } break;
          default: {
            this._message.success('Uploading completed');
            fsFile.progress = false;
          }
        }
      }, () => {
        this._message.error('Uploading error');
        fsFile.obserable = null;
      }, () => {
        fsFile.obserable = null;
      });

      setTimeout(() => {
        if (fsFile.obserable) {
          fsFile.obserable.unsubscribe();
          this._message.warning('Uploading has been canceled');
          fsFile.progress = false;
        }
      }, 500)
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
