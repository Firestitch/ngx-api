import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { finalize } from 'rxjs/operators';

import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'single-upload',
  templateUrl: './single-upload.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingleUploadComponent {

  public files = [];
  public percent = 0;
  public kbLoaded = 0;
  public url = '/api';

  constructor(
    private _api: FsApi,
  ) {}

  public upload() {
    const data = { object: { date: new Date(), file: null }, file: null };
    this.files.forEach((fsFile, index) => {
      data.file = fsFile.file;
      data.object.file = fsFile.file;
      this.kbLoaded = 0;
      this.percent = 0;

      this._api.post(this.url, data, { reportProgress: true })
        .pipe(
          finalize(() => {
            this.percent = 0;
            fsFile.progress = false;
          }),
        )
        .subscribe((event) => {
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
        });
    });
  }

  public remove(fsFile) {
    // if (fsFile.obserable) {
    //   fsFile.obserable.unsubscribe();
    // }
  }

  public select(file) {
    this.files = [file];
  }
}
