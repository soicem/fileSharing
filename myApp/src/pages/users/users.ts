import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-users',
  templateUrl: 'users.html',
})
export class UsersPage {

  private users : any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initPage();
  }

  initPage(){
    var userRef = firebase.database().ref("users/");
    userRef.once("value", (items: any)=>{
      this.users = [];
      if(items.val()){
        items.forEach((item)=>{
          this.users.push({
            name : item.val().name,
            group : item.val().group,
            date : item.val().date,
            email : item.val().email
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
  ionViewDidLoad() {
    console.log('ionViewDidLoad UsersPage');
  }

}
