import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SavedFilePage } from './saved-file';

@NgModule({
  declarations: [
    SavedFilePage,
  ],
  imports: [
    IonicPageModule.forChild(SavedFilePage),
  ],
})
export class SavedFilePageModule {}
