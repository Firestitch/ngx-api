import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { FsApiModule, FsApiConfig, FsApi }  from '@firestitch/api';
import { FsCommonModule }  from '@firestitch/common';

@Component({
    selector: 'app-root',
    templateUrl: 'template.html',
    styleUrls: [ 'styles.css' ],
    encapsulation: ViewEncapsulation.None
  })
class AppComponent {

  data: Array<any> = null;
  constructor(private FsApi: FsApi) {}

  public get() {
    //this.FsApi.get('https://boilerplate.firestitch.com/api/dummy', new FsApiConfig({ key: 'objects',
    //                                                                                query: { fffexception: 'Bad!!!!' },
    //                                                                                headers: { 'test': '!!!!!!!!!!!' } }))

    this.FsApi.get('https://boilerplate.firestitch.com/api/dummy', { fffexception: 'OK!!!!' }, { key: 'objects', headers: { 'test': '!!!!!!!!!!!' } })
    .subscribe(resp => {
      this.data = resp;
    });
  }
}

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [ AppComponent ],
  imports: [ BrowserModule, FsCommonModule, FsApiModule ]
})
class AppModule {}

platformBrowserDynamic().bootstrapModule(AppModule);
