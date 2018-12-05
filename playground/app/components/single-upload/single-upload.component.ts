import { Component } from '@angular/core';
import { HttpEventType } from '@angular/common/http';

import * as moment from 'moment';

import { FsApi } from '../../../../src';

@Component({
  selector: 'single-upload',
  templateUrl: 'single-upload.component.html'
})
export class SingleUploadComponent {

  files = [];
  percent = 0;
  kbLoaded = 0;
  url = '/api';
  constructor(private fsApi: FsApi) {}

  public upload() {

    const data = { moment: moment(), object: { date: new Date(), file: null }, file: null };
    this.files.forEach((fsFile, index) => {
      data.file = fsFile.file;
      data.object.file = fsFile.file;
      this.kbLoaded = 0;
      this.percent = 0;

      fsFile.obserable = this.fsApi.post(this.url, data, { reportProgress: true })
      .subscribe(event => {

        if (event.type === HttpEventType.Sent) {
          fsFile.progress = true;
        }

        if (event.type === HttpEventType.UploadProgress) {
          this.kbLoaded = Math.round(event.loaded / 1024);
          this.percent = Math.round((event.loaded / event.total) * 100);
        }

        if (event.type === HttpEventType.ResponseHeader) {

        }

        if (event.type === HttpEventType.DownloadProgress) {

        }

        if (event.type === HttpEventType.Response) {

        }
      }, (err) => {
      }, () => {
        this.percent = 0;
        fsFile.progress = false;
      });
    });
  }

  public remove(fsFile) {
    if (fsFile.obserable) {
      fsFile.obserable.unsubscribe();
    }
  }

  public select(file) {
    this.files = [file];
  }
}
