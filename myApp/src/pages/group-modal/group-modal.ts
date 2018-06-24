import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-group-modal',
  templateUrl: 'group-modal.html',
})
export class GroupModalPage {
  private groups = [
    {
      name: 'Bacon'
    },
    {
      name: 'Black Olives'
    },
    {
      name: 'Extra cheese'
    }
  ]


  constructor(public navCtrl: NavController,
    private viewCtrl : ViewController, 
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GroupModalPage');
  }

  cancel(){
    this.viewCtrl.dismiss();
  }

  clickGroup(group){
    this.viewCtrl.dismiss(group);
  }
}
