import { Injector, enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

import { FS_API_REQUEST_INTERCEPTOR, FsApi, FsApiModule } from '@firestitch/api';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
import { FsMessage, FsMessageModule } from '@firestitch/message';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { FS_API_PRE_REQUEST_INTERCEPTOR, FS_API_PRE_RESPONSE_INTERCEPTOR } from 'src/app/fs-api-injectors';
import { provideAnimations } from '@angular/platform-browser/animations';

import { AlertInterceptorFactory, ErrorInterceptorFactory, HttpInterceptor, PreInterceptorFactory, PreResponseInterceptorFactory, TokenInterceptorFactory } from './app/interceptors';
import { TestService } from './app/services/test.service';
import { environment } from './environments/environment';
import { TEST_URL } from './app/injectors';
import { NewFsApi } from './app/services/new-api.service';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, FsApiModule.forRoot({
      maxFileConnections: 5,
    }), FormsModule, FsExampleModule.forRoot({ iframeObserveBody: true }), FsFileModule.forRoot(), FsMessageModule.forRoot()),
    TestService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptor,
      multi: true,
    },
    {
      provide: FS_API_PRE_REQUEST_INTERCEPTOR,
      useFactory: PreInterceptorFactory,
      deps: [FsMessage],
      multi: true,
    },
    {
      provide: FS_API_PRE_RESPONSE_INTERCEPTOR,
      useFactory: PreResponseInterceptorFactory,
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
    provideRouter([]),
    provideAnimations(),
  ],
})
  .catch((err) => console.error(err));

