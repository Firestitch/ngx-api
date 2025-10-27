import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

import { FsApi } from '@firestitch/api';

import { TEST_URL } from 'playground/app/injectors';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'download-blob',
    templateUrl: './download-blob.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButton],
})
export class DownloadBlobComponent {
  
  constructor(
    @Inject(TEST_URL) private _url: string,
    private _api: FsApi,
  ) { }

  public downloadUrl() {
    const url = '/assets/dog-puppy-on-garden-royalty-free-image-1586966191.jpg';
    this._api.createApiFile(url)
      .download();
  }

  public downloadApi() {
    this._api
      .createApiFile([this._url, 'download'])
      .download();
  }
}
