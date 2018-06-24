import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReceivedFilePage } from './received-file';

@NgModule({
  declarations: [
    ReceivedFilePage,
  ],
  imports: [
    IonicPageModule.forChild(ReceivedFilePage),
  ],
})
export class ReceivedFilePageModule {}
