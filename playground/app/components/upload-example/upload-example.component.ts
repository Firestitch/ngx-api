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

    let data = { moment: null, object: { date: new Date() }, file: null };
    this.files.forEach((file, index) => {
      data.file = file.file;

      this.FsApi.post(this.url, data, { reportProgress: true })
      .subscribe(event => {
        if (event.type === HttpEventType.Sent) {
          file.progress = true;
        }

        if (event.type === HttpEventType.UploadProgress) {
          const kbLoaded = Math.round(event.loaded / 1024);
          const percent = Math.round((event.loaded / event.total) * 100);
          console.log({ kbLoaded: kbLoaded, percent: percent });
        }

        if (event.type === HttpEventType.ResponseHeader) {

        }

        if (event.type === HttpEventType.DownloadProgress) {

        }

        if (event.type === HttpEventType.Response) {
          file.progress = false;
        }
      });
    });
  }

  public select(files) {
    this.files = this.files.concat(files);
  }
}
