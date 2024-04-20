import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';

import { finalize } from 'rxjs/operators';

import { HttpEventType } from '@angular/common/http';


@Component({
  selector: 'upload-example',
  templateUrl: './upload-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadExampleComponent {

  public files = [];
  public url = 'https://specify.firestitch.dev/api/dummy';
  constructor(private _api: FsApi, private _message: FsMessage) {}

  public upload() {

    const data = {
      objectFile: { file: null },
      object: { date: new Date() },
      file: null,
    };

    this.files.forEach((fsFile) => {
      data.file = fsFile.file;
      data.objectFile.file = fsFile.file;

      fsFile.obserable = this._api.post(this.url, data, { reportProgress: true })
        .pipe(
          finalize(() => {
            fsFile.progress = false;
          }),
        )
        .subscribe((event) => {
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
