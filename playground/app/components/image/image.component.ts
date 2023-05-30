import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { FsApi } from '@firestitch/api';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-image',
  templateUrl: 'image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {

  public url = '/assets/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?testing=true';
  public safeDataUrl: Observable<SafeUrl>;
  public safeBase64Url: Observable<SafeUrl>;


  public constructor(
    private _api: FsApi
  ) {
    this.safeDataUrl = this._api.createApiFile(this.url).safeDataUrl;
    this.safeBase64Url = this._api.createApiFile(this.url).safeBase64Url;
  }

  public download(): void {
    this._api
      .createApiFile(this.url)
      .download();
  }

}
