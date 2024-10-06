import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { HttpBackend, HttpXhrBackend, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { FsApiImageDirective } from './directives';
import { FS_API_CONFIG } from './fs-api-providers';
import { IModuleConfig } from './interfaces/module-config.interface';
import { FsApiImagePipe } from './pipes';


@NgModule({ declarations: [
        FsApiImageDirective,
        FsApiImagePipe,
    ],
    exports: [
        FsApiImageDirective,
        FsApiImagePipe,
    ], imports: [CommonModule], providers: [
        HttpXhrBackend,
        { provide: HttpBackend, useExisting: HttpXhrBackend },
        provideHttpClient(withInterceptorsFromDi()),
    ] })
export class FsApiModule {
  public static forRoot(config: IModuleConfig = {}): ModuleWithProviders<FsApiModule> {
    return {
      ngModule: FsApiModule,
      providers: [
        { provide: FS_API_CONFIG, useValue: config },
      ],
    };
  }
}
