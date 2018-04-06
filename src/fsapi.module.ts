import { HttpClientModule } from '@angular/common/http';
import { FsApiConfig, FsApi } from './';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
],
declarations: [],
providers: [
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
