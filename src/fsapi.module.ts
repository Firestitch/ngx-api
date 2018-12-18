import { HttpBackend, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsApiConfig, FsApi, FS_API_CONFIG } from './';
import { IModuleConfig } from './interfaces';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [],
  providers: [
    FsApi,
    FsApiConfig,
    HttpXhrBackend,
    { provide: HttpBackend, useExisting: HttpXhrBackend },
  ],
  exports: []
})
export class FsApiModule {
  static forRoot(config: IModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: FsApiModule,
      providers: [
        { provide: FS_API_CONFIG, useValue: config },
        FsApiConfig,
        FsApi,
      ]
    };
  }
}
