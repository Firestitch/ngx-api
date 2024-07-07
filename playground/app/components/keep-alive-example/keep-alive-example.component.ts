import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';

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
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) {}

  public error(count) {
    const query = {
      keepAlive: count,
    };

    this.data = [];
    this._api
      .get(this._url, query)
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
