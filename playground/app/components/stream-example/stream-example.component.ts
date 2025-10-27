import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy,
} from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsMessage } from '@firestitch/message';


import { Subject } from 'rxjs';

import { TEST_URL } from 'playground/app/injectors';
import { StreamEventComplete, StreamEventData } from 'src/app';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';


@Component({
    selector: 'app-stream-example',
    templateUrl: './stream-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButton, JsonPipe],
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
      sleep: .1,
      exception,
    };

    this.data = [];
    this._api
      .stream('get', `${this._url}/stream`, query)
      .subscribe((data) => {
        if(data instanceof StreamEventData) {
          this.data.push(data);
          this._cdRef.markForCheck();
        }

        if(data instanceof StreamEventComplete) {
          this._message.success(`Done (${data.code})`);
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
