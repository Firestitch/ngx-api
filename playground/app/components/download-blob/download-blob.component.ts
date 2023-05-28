import { Component } from '@angular/core';

import { FsApi, ResponseType } from '@firestitch/api';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'download-blob',
  templateUrl: 'download-blob.component.html'
})
export class DownloadBlobComponent {

  public apiFile;

  constructor(
    private _api: FsApi,
  ) {}

  public download() {
    const url = '/assets/dog-puppy-on-garden-royalty-free-image-1586966191.jpg';
    this.apiFile = this._api.createApiFile(url);
  }
}
