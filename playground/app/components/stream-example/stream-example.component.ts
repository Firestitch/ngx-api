import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';


import { of, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';

import { HttpErrorResponse } from '@angular/common/http';
import { TEST_URL } from 'playground/app/injectors';
import { StreamEventType } from 'src/app/enums';
import { StreamEventData } from 'src/app/interfaces';


@Component({
  selector: 'app-stream-example',
  templateUrl: './stream-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamExampleComponent implements OnDestroy {

  public data = [];

  private _destroy$ = new Subject();

  constructor(
    @Inject(TEST_URL) private _url: string,
    private _api: FsApi,
    private _cdRef: ChangeDetectorRef,
    private _message: FsMessage,
  ) {}

  public error() {
    this.get('Some bad happened');
  }
  
  public get(exception?) {
    const query = {
      count: 20,
      exception,
    };

    this.data = [];
    this._api
      .stream('get', `${this._url}/stream`, query)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this._message.error(error.statusText);

          return of(error);
        }), 
        takeUntil(this._destroy$),
      )
      .subscribe((data: StreamEventData) => {
        if(data.type === StreamEventType.Data) {
          this.data.push(data);
          this._cdRef.markForCheck();
        }

        if(data.type === StreamEventType.HttpResponse) {
          this._message.success('Done');
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
