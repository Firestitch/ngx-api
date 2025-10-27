import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { MatButton } from '@angular/material/button';

import { FsApi } from '@firestitch/api';

import { TEST_URL } from 'playground/app/injectors';


@Component({
  selector: 'download-blob',
  templateUrl: './download-blob.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton],
})
export class DownloadBlobComponent {
  
  private _url = inject(TEST_URL);
  private _api = inject(FsApi);


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
