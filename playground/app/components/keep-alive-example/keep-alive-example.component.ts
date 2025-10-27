import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';


import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TEST_URL } from 'playground/app/injectors';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'app-keep-alive-example',
    templateUrl: './keep-alive-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButton, JsonPipe],
})
export class KeepAliveExampleComponent implements OnDestroy {
  private _url = inject(TEST_URL);
  private _api = inject(FsApi);
  private _message = inject(FsMessage);


  public data = [];

  private _destroy$ = new Subject();

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
