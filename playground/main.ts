import { enableProdMode, Injector, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { TestService } from './app/services/test.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpInterceptor, PreInterceptorFactory, PreResponseInterceptorFactory, AlertInterceptorFactory, TokenInterceptorFactory, ErrorInterceptorFactory } from './app/interceptors';
import { FS_API_PRE_REQUEST_INTERCEPTOR, FS_API_PRE_RESPONSE_INTERCEPTOR } from 'src/app/fs-api-injectors';
import { FS_API_REQUEST_INTERCEPTOR, FsApi, FsApiModule } from '@firestitch/api';
import { FsMessage, FsMessageModule } from '@firestitch/message';
import { NewFsApi } from './app/services/new-api.service';
import { TEST_URL } from './app/injectors';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsExampleModule } from '@firestitch/example';
import { FsFileModule } from '@firestitch/file';
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
    ]
})
  .catch(err => console.error(err));

