import { Component } from '@angular/core';
import { FsApi, ResponseType } from '../../../../src';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'upload-example',
  templateUrl: 'upload-example.component.html'
})
export class UploadExampleComponent {

  files = [];
  url = 'https://boilerplate.firestitch.com/api/dummy';
  constructor(private FsApi: FsApi) {}

  public upload() {

    const data = { moment: null, object: { date: new Date() }, file: null };
    this.files.forEach((fsFile, index) => {
      data.file = fsFile.file;

      fsFile.obserable = this.FsApi.post(this.url, data, { reportProgress: true })
      .subscribe(event => {

        if (event.type === HttpEventType.Sent) {
          fsFile.progress = true;
        }

        if (event.type === HttpEventType.UploadProgress) {

        }

        if (event.type === HttpEventType.ResponseHeader) {

        }

        if (event.type === HttpEventType.DownloadProgress) {

        }

        if (event.type === HttpEventType.Response) {
          fsFile.progress = false;
        }
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
