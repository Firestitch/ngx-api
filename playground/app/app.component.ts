import { ChangeDetectionStrategy, Component } from '@angular/core';

import { environment } from '../environments/environment';
import { FsExampleModule } from '@firestitch/example';
import { FirstExampleComponent } from './components/first-example/first-example.component';
import { UploadExampleComponent } from './components/upload-example/upload-example.component';
import { SingleUploadComponent } from './components/single-upload/single-upload.component';
import { UploadCancelExampleComponent } from './components/upload-cancel-example/upload-cancel-example.component';
import { StreamExampleComponent } from './components/stream-example/stream-example.component';
import { ImageComponent } from './components/image/image.component';
import { DownloadBlobComponent } from './components/download-blob/download-blob.component';
import { KeepAliveExampleComponent } from './components/keep-alive-example/keep-alive-example.component';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FsExampleModule,
        FirstExampleComponent,
        UploadExampleComponent,
        SingleUploadComponent,
        UploadCancelExampleComponent,
        StreamExampleComponent,
        ImageComponent,
        DownloadBlobComponent,
        KeepAliveExampleComponent,
    ],
})
export class AppComponent {
  public config = environment;
}
