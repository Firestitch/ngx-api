import { FsUtil } from '@firestitch/common';

import { HttpClientModule } from '@angular/common/http';
import { FsApiConfig, FsApi } from './fsapi.service';

import { JsonpModule } from '@angular/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from './fsapi.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
],
declarations: [],
providers: [
    FsUtil,
    FsApi,
    FsApiConfig
],
exports: [
]
})
export class FsApiModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: FsApiModule,
      providers: [FsApiConfig, FsApi]
    };
  }
}
