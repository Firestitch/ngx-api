import './../tools/assets/playground.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsApiModule } from '../src';

import { AppComponent } from './app/app.component';
import { AppMaterialModule } from './app/material.module';
import { FsExamplesComponent } from '../tools/components/examples/examples.component';
import { FirstExampleComponent } from './app/components/first-example/first-example.component';
import { UploadExampleComponent } from './app/components/upload-example/upload-example.component';
import { SingleUploadComponent } from './app/components/single-upload/single-upload.component';

import {
  FS_API_REQUEST_INTERCEPTORS,
  FS_API_RESPONSE_HANDLER,
} from '../src/fsapi-providers';

import { TestService } from './app/services/test.service';


import { AlertInterceptor, TokenInterceptor } from './app/interceptors';
import { ResponseHandler } from './app/interceptors/response.handler';


// export class FsApiApp extends FsApi {

//   public intercept(config: FsApiConfig, request: HttpRequest<any>, next: FsApiHandler) {
//     return Observable.create(observer => {

//       next.handle(request.clone({ headers: request.headers.append('api-key', 'XXXXXXX') }))
//       .filter((event) => event.type === HttpEventType.Response)
//       .subscribe((event: HttpResponse<any>) => {

//         let body = event.body.data;
//         if (config.key) {
//           body = body[config.key];
//         }

//         observer.next(event.clone({ body: body }));
//       },
//       err => {
//         alert(err.statusText);
//       },
//       () => observer.complete());
//     });
//   }
// }

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsApiModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsExampleModule,
    FsFileModule
  ],
  entryComponents: [
  ],
  declarations: [
    AppComponent,
    FirstExampleComponent,
    FsExamplesComponent,
    UploadExampleComponent,
    SingleUploadComponent
  ],
  providers: [
    TestService,

    { provide: FS_API_REQUEST_INTERCEPTORS, useValue: AlertInterceptor, multi: true },
    { provide: FS_API_REQUEST_INTERCEPTORS, useValue: TokenInterceptor, multi: true },

    { provide: FS_API_RESPONSE_HANDLER, useClass: ResponseHandler, deps: [ TestService ] }, // example with fsStor like
  ],
})
export class PlaygroundModule {
  constructor() {}
}
