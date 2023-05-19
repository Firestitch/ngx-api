import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FsApi } from '@firestitch/api';


@Component({
  selector: 'app-image',
  templateUrl: 'image.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent {

  public url = '/assets/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?testing=true';


  public constructor(
    private _api: FsApi
  ) {}

  public download(): void {
    this._api.createApiFile(this.url)
      .download();
  }

}
