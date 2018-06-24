import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupModalPage } from './group-modal';

@NgModule({
  declarations: [
    GroupModalPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupModalPage),
  ],
})
export class GroupModalPageModule {}
