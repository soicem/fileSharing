import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrivateModalPage } from './private-modal';

@NgModule({
  declarations: [
    PrivateModalPage,
  ],
  imports: [
    IonicPageModule.forChild(PrivateModalPage),
  ],
})
export class PrivateModalPageModule {}
