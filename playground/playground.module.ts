import './../tools/assets/playground.scss';

import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app/app.component';
import { BrowserModule } from '@angular/platform-browser';
import { FsApiModule, FsApi } from '../src';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from './app/material.module';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FirstExampleComponent } from './app/components/first-example/first-example.component';
import { UploadExampleComponent } from './app/components/upload-example/upload-example.component';
import { SingleUploadComponent } from './app/components/single-upload/single-upload.component';

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
    UploadExampleComponent,
    SingleUploadComponent
  ],
  providers: [
  ],
})
export class PlaygroundModule {

  constructor(private FsApi: FsApi) {
    FsApi.on('begin', function(request) {
      Object.assign(request, request.clone({ headers: request.headers.append('api-key','34095td98yvhs9w8dg6yd78yg0sd76gas98d67') }));
      console.log('Begin', request);
    })
    .on('success', function(event, FsApiConfig) {

      event.body = event.body.data;
      if (FsApiConfig.key) {
        event.body = event.body[FsApiConfig.key];
      }

      console.log('Success', event);
    })
    .on('error', function(event) {
      alert(event.statusText);
      console.log('Error', event);
    })
    .on('complete', function() {
      console.log('Complete');
    });
  }
}
