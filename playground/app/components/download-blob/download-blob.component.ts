import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FsApi } from '@firestitch/api';


@Component({
  selector: 'download-blob',
  templateUrl: './download-blob.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DownloadBlobComponent {

  constructor(
    private _api: FsApi,
  ) { }

  public downloadUrl() {
    const url = '/assets/dog-puppy-on-garden-royalty-free-image-1586966191.jpg';
    this._api.createApiFile(url)
      .download();
  }

  public downloadApi() {
    this._api.createApiFile('https://specify.firestitch.dev/api/dummy/download')
      .download();
  }
}
