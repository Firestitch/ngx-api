import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';

import { HttpBackend, HttpClientModule, HttpXhrBackend } from '@angular/common/http';

import { FsApiImageDirective } from './directives';
import { FS_API_CONFIG } from './fs-api-providers';
import { IModuleConfig } from './interfaces/module-config.interface';
import { FsApiImagePipe } from './pipes';
import { FsApi } from './services/api.service';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  declarations: [
    FsApiImageDirective,
    FsApiImagePipe,
  ],
  providers: [
    FsApi,
    HttpXhrBackend,
    { provide: HttpBackend, useExisting: HttpXhrBackend },
  ],
  exports: [
    FsApiImageDirective,
    FsApiImagePipe,
  ],
})
export class FsApiModule {
  public static forRoot(config: IModuleConfig = {}): ModuleWithProviders<FsApiModule> {
    return {
      ngModule: FsApiModule,
      providers: [
        { provide: FS_API_CONFIG, useValue: config },
        FsApi,
      ],
    };
  }
}
