import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ngfModule, ngf } from "angular-file";
import { Subscription } from 'rxjs';
import moment from 'moment';
import { FsApiHandler, FsApiModule, FsApiConfig, FsApi }  from '@firestitch/api';
import { FsCommonModule }  from '@firestitch/common';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';

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

@Component({
    selector: 'app-root',
    templateUrl: 'template.html',
    styleUrls: [ 'styles.css' ],
    encapsulation: ViewEncapsulation.None
  })
class AppComponent {

  data: Array<any> = null;
  file: null;
  url = 'https://boilerplate.firestitch.com/api/dummy';
  constructor(private FsApi: FsApi) {}

  uploadFiles(file: File) {

    console.log(file);
    this.FsApi.post(this.url, { file: file })
    .subscribe(resp => {
    });
  }

  public post() {

    let data = { moment: null, object: { date: new Date() } };

    this.FsApi.post(this.url, data)
    .subscribe(resp => {
      this.data = resp;
    });
  }

  public getException() {
    this.get({ exception: '400 Exception Message' });
  }

  public get(query) {
    this.FsApi.get(this.url, query, { key: 'objects' })
    //, headers: { 'test': '!!!!!!!!!!!' } 
    //.map(resp => this.mapp(resp) )
    .subscribe(resp => {
      this.data = resp;
    });
  }

  public mapp(resp) {
    return { data: resp.data.objects };
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FsCommonModule, FsApiModule, ngfModule ],
  // providers: [
  //   {
  //     provide: FsApi,
  //     useClass: FsApiApp
  //   }
  // ]
})
class AppModule {

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
      alert(event.target.statusText);
      console.log('Error', event);
    })
    .on('complete', function() {
      console.log('Complete');
    });
  }
}

platformBrowserDynamic().bootstrapModule(AppModule);
