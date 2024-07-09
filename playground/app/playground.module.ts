import { Injector, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import {
  FS_API_REQUEST_INTERCEPTOR,
  FsApi,
  FsApiModule,
} from '@firestitch/api';
import { FsCommonModule } from '@firestitch/common';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsMessage, FsMessageModule } from '@firestitch/message';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FS_API_PRE_REQUEST_INTERCEPTOR } from 'src/app/fs-api-providers';

import { AppComponent } from './app.component';
import { ImageComponent, KeepAliveExampleComponent, StreamExampleComponent } from './components';
import { DownloadBlobComponent } from './components/download-blob/download-blob.component';
import { FirstExampleComponent } from './components/first-example/first-example.component';
import { SingleUploadComponent } from './components/single-upload/single-upload.component';
import { UploadCancelExampleComponent } from './components/upload-cancel-example/upload-cancel-example.component';
import { UploadExampleComponent } from './components/upload-example/upload-example.component';
import { TEST_URL } from './injectors';
import {
  AlertInterceptorFactory,
  ErrorInterceptorFactory,
  PreInterceptorFactory,
  TokenInterceptorFactory,
} from './interceptors';
import { AppMaterialModule } from './material.module';
import { NewFsApi } from './services/new-api.service';
import { TestService } from './services/test.service';


@NgModule({
  bootstrap: [AppComponent],
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
  ],
  declarations: [
    AppComponent,
    FirstExampleComponent,
    UploadExampleComponent,
    SingleUploadComponent,
    UploadCancelExampleComponent,
    DownloadBlobComponent,
    ImageComponent,
    StreamExampleComponent,
    KeepAliveExampleComponent,
  ],
  providers: [
    TestService,
    { 
      provide: FS_API_PRE_REQUEST_INTERCEPTOR, 
      useFactory: PreInterceptorFactory, 
      multi: true, 
    },
    { 
      provide: FS_API_REQUEST_INTERCEPTOR, 
      useFactory: AlertInterceptorFactory, 
      deps: [FsMessage], 
      multi: true, 
    },
    { 
      provide: FS_API_REQUEST_INTERCEPTOR, 
      useFactory: TokenInterceptorFactory, 
      multi: true, 
    },
    { 
      provide: FS_API_REQUEST_INTERCEPTOR, 
      useFactory: ErrorInterceptorFactory, 
      deps: [Injector],
      multi: true, 
    },
    { provide: FsApi, useClass: NewFsApi },
    { provide: TEST_URL, 
      useFactory: () => {
        return document.location.hostname === 'localhost' ? 
          'https://specify.local.firestitch.com/api/dummy' :
          'https://specify.firestitch.dev/api/dummy';
      }, 
    },
  ],
})
export class PlaygroundModule {
}
