import { HttpBackend, HttpClientModule, HttpXhrBackend } from '@angular/common/http';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FS_API_CONFIG } from './fs-api-providers';
import { FsApi } from './services/api.service';
import { FsApiConfig } from './classes/api-config';
import { IModuleConfig } from './interfaces/module-config.interface';
import { FsApiImageDirective } from './directives';
import { FsApiImagePipe } from './pipes';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    FsApiImageDirective,
    FsApiImagePipe,
  ],
  providers: [
    FsApi,
    FsApiConfig,
    HttpXhrBackend,
    { provide: HttpBackend, useExisting: HttpXhrBackend },
  ],
  exports: [
    FsApiImageDirective,
    FsApiImagePipe,
  ]
})
export class FsApiModule {
  static forRoot(config: IModuleConfig = {}): ModuleWithProviders<FsApiModule> {
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
