import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-send-message',
  templateUrl: 'send-message.html',
})
export class SendMessagePage {
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.initPage();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SendMessagePage');
  }
  private messages : any;
  initPage() {
    var user = firebase.auth().currentUser;
    console.log(user);
    this.messages = [];

    if (user) {
      var userRef = firebase.database().ref('/sendMessages/');
      userRef.once("value", (items: any)=>{
        this.messages = [];
        if(items.val()){
          items.forEach((item)=>{
            this.messages.push({
            key : item.val().key,
            senderName:item.val().senderName,
            senderId : item.val().senderId,
            pushMode: item.val().pushMode,
            message: item.val().message,
            date : item.val().date
            });
          });
          console.log(this.messages);
        } else {
          console.log("no users");
        }
      }).then(()=>{

      }).catch((error)=>{
        console.log(error.message);
      });
      
      
    } else {
      // No user is signed in.
    }
  }
}
