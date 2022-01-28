import { Component } from '@angular/core';

import { FsApi, ResponseType } from '@firestitch/api';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'download-blob',
  templateUrl: 'download-blob.component.html'
})
export class DownloadBlobComponent {

  public src;

  constructor(
    private _api: FsApi,
    private _sanitizer: DomSanitizer,
  ) {}

  public download() {
    const url = '/assets/dog-puppy-on-garden-royalty-free-image-1586966191.jpg';
    this._api.get(url, {}, { handlers: false, responseType: ResponseType.Blob })
      .subscribe((blob) => {
        this.src = this._sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      });
  }
}
