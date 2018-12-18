import './styles.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsMessageModule, FsMessage } from '@firestitch/message';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app/app.component';
import { AppMaterialModule } from './app/material.module';
import { FirstExampleComponent } from './app/components/first-example/first-example.component';
import { UploadExampleComponent } from './app/components/upload-example/upload-example.component';
import { SingleUploadComponent } from './app/components/single-upload/single-upload.component';
import { UploadCancelExampleComponent } from './app/components/upload-cancel-example/upload-cancel-example.component';

import {
  FsApiModule,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '../src';
import { TestService } from './app/services/test.service';
import {
  AlertInterceptorFactory,
  TokenInterceptorFactory
} from './app/interceptors';
import { ResponseHandler } from './app/interceptors/response.handler';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsApiModule.forRoot({
      queueSize: 3,
    }),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot({ iframeObserveBody: true }),
    FsFileModule,
    FsMessageModule.forRoot(),
    ToastrModule.forRoot({ preventDuplicates: true }),
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    FirstExampleComponent,
    UploadExampleComponent,
    SingleUploadComponent,
    UploadCancelExampleComponent
  ],
  providers: [
    TestService,
    { provide: FS_API_REQUEST_INTERCEPTOR, useFactory: AlertInterceptorFactory, deps: [ FsMessage ], multi: true },
    { provide: FS_API_REQUEST_INTERCEPTOR, useFactory: TokenInterceptorFactory, multi: true },
    { provide: FS_API_RESPONSE_HANDLER, useClass: ResponseHandler, deps: [ FsMessage ] }
  ],
})
export class PlaygroundModule {
  constructor() {}
}
