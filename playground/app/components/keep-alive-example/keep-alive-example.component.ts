import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TEST_URL } from 'playground/app/injectors';


@Component({
  selector: 'app-keep-alive-example',
  templateUrl: './keep-alive-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeepAliveExampleComponent implements OnDestroy {

  public data = [];

  private _destroy$ = new Subject();

  constructor(
    @Inject(TEST_URL) private _url: string,
    private _api: FsApi,
    private _message: FsMessage,
  ) {}

  public get(count, exception?) {
    const query = {
      keepAlive: count,
      exception,
    };

    this.data = [];
    this._api
      .get(this._url, query)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        this._message.success('Done!'); 
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
