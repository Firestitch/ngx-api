import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';


import { FsApi } from '@firestitch/api';


import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { TEST_URL } from 'playground/app/injectors';
import { MatButton } from '@angular/material/button';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'first-example',
    templateUrl: './first-example.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButton, JsonPipe],
})
export class FirstExampleComponent {
  private _url = inject(TEST_URL);
  private _api = inject(FsApi);
  private _cdRef = inject(ChangeDetectorRef);


  public data: any[] = null;
  public file: null;

  public uploadFiles(file: File) {
    this._api.post(this._url, { file })
      .subscribe();
  }

  public post() {
    const data = {
      text: 'Hello',
      integer: 5674325,
      date: new Date(),
      array: [1,2,3],
      arrayObject: [{ id: 1 }, { id: 2 }],
      object: { date: new Date() },
    };

    this._api
      .post(this._url, data, {
        encoding: null,
      })
      .subscribe((resp) => {
        this.data = resp;
        this._cdRef.markForCheck();
      });
  }

  public getException() {
    this.get({ exception: '400 Exception Message' });
  }

  public get(query, cache = false) {
    query.nullValue = null;
    query.objectValue = { name: 'Name', value: 999, childObject: { id: 555 } };
    query.arrayObjects = [{ name: 'Element 1', value: 1 }, { name: 'Element 2', value: 2 }];
    query.arrayStrings = ['active', 'pending'];
    query.date = { date: new Date() };

    this._api.get(this._url, query, { key: 'objects', cache })
      .subscribe((resp) => {

        console.log(resp);
        this.data = resp;
        this._cdRef.markForCheck();
      });
  }

  public blob() {
    const url = `${this._url}/download`;
    this._api.createApiFile(url)
      .blob
      .pipe(
        switchMap((blob) => from(blob.text())),
      )
      .subscribe((resp) => {
        this.data = [resp];
        this._cdRef.markForCheck();
      });
  }
}
