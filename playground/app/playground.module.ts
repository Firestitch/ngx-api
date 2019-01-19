import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsMessageModule, FsMessage } from '@firestitch/message';
import { FsCommonModule } from '@firestitch/common';
import {
  FsApiModule,
  FS_API_REQUEST_INTERCEPTOR,
  FS_API_RESPONSE_HANDLER,
} from '@firestitch/api';

import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import { FirstExampleComponent } from './components/first-example/first-example.component';
import { UploadExampleComponent } from './components/upload-example/upload-example.component';
import { SingleUploadComponent } from './components/single-upload/single-upload.component';
import { UploadCancelExampleComponent } from './components/upload-cancel-example/upload-cancel-example.component';

import { TestService } from './services/test.service';
import {
  AlertInterceptorFactory,
  TokenInterceptorFactory
} from './interceptors';
import { ResponseHandler } from './interceptors/response.handler';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsApiModule.forRoot({
      maxFileConnections: 5,
    }),
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule.forRoot({ iframeObserveBody: true }),
    FsFileModule.forRoot(),
    FsCommonModule,
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
