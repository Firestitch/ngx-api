import { HttpBackend, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsApiConfig, FsApi } from './';


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
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsApiModule,
      providers: [FsApiConfig, FsApi]
    };
  }
}
