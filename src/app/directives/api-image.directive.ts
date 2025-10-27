import { Directive, ElementRef, Input, OnInit, inject } from '@angular/core';

import { FsApi } from '../services';


@Directive({
    selector: '[fsApiImage]',
    standalone: true,
})
export class FsApiImageDirective implements OnInit {
  private _api = inject(FsApi);
  private _el = inject(ElementRef);


  @Input() url: string;

  public src;
  public display: string;

  constructor() {
    this.display = this._el.nativeElement.style.display;
    this._el.nativeElement.style.display = 'none';
  }

  public ngOnInit(): void {
    const file = this._api.createApiFile(this.url);

    file.blobUrl
      .subscribe((data) => {
        this._el.nativeElement.setAttribute('src', data);
        this._el.nativeElement.style.display = this.display;
      });
  }
}
