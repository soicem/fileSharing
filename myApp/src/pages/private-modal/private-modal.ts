import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-private-modal',
  templateUrl: 'private-modal.html',
})
export class PrivateModalPage {
  private users : any;
  constructor(public navCtrl: NavController,
    private viewCtrl : ViewController, 
    public navParams: NavParams) {
      this.initPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrivateModalPage');
  }

  initPage(){
    var userRef = firebase.database().ref("users/");
    userRef.once("value", (items: any)=>{
      this.users = [];
      if(items.val()){
        items.forEach((item)=>{
          this.users.push({
            name : item.val().name,
            email : item.val().email,
            playerId : item.val().playerId
          });
        });
      } else {
        console.log("no users");
      }
    }).then(()=>{

    }).catch((error)=>{
      console.log(error.message);
    });
      
  }
  cancel(){
    this.viewCtrl.dismiss();
  }

  clickUser(user){
    this.viewCtrl.dismiss(user);
  }
}
