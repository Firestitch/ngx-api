import './../tools/assets/playground.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FsApiModule } from '../src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app/material.module';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsExamplesComponent } from '../tools/components/examples/examples.component';
import { FirstExampleComponent } from './app/components/first-example/first-example.component';
import { UploadExampleComponent } from './app/components/upload-example/upload-example.component';
import { SingleUploadComponent } from './app/components/single-upload/single-upload.component';
import {
  API_COMPLETE_HANDLER, API_CUSTOM_INTERCTEPTORS,
  API_ERROR_HANDLER,
  API_SUCCESS_HANDLER,
} from '../src';
import { TestService } from './app/services/test.service';

import {
  ApiSuccessHandler,
  ApiErrorHandler,
  ApiCompleteHandler
} from './api-handlers';
import { AlertInterceptor, TokenInterceptor } from './app/interceptors';


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

    { provide: API_CUSTOM_INTERCTEPTORS, useValue: AlertInterceptor, multi: true },
    { provide: API_CUSTOM_INTERCTEPTORS, useValue: TokenInterceptor, multi: true },

    { provide: API_SUCCESS_HANDLER, useFactory: ApiSuccessHandler, deps: [ TestService ] },
    { provide: API_ERROR_HANDLER, useValue: ApiErrorHandler },
    { provide: API_COMPLETE_HANDLER, useValue: ApiCompleteHandler }
  ],
})
export class PlaygroundModule {
  constructor() {}
}
