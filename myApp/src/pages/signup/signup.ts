import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  private account :any={
    name:'',
    email:'',
    password:'',
    group:''
  }
  private playerId : any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams) {
      this.getOneSignalPlayerId(); // get playerId in this function
      console.log(this.playerId);
      console.log(this.account);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  // email과 password로 firebase authentication을 활용해서 회원가입한다.
  async signup(){
    try{
      const result = await firebase.auth().createUserWithEmailAndPassword(this.account.email, 
      this.account.password);
      if(result){
        var today = moment().format('YYYY-MM-DD');
        var tmpData = {
          name: this.account.name,
          email : this.account.email,
          uid: result.uid,
          group: this.account.group,
          password: this.account.password,
          date : today,
          playerId: this.playerId,
        };
        console.log(tmpData);
        var updates = {};
        updates['/users/' + tmpData.uid] = tmpData;
        firebase.database().ref().update(updates)
          .then(()=>{
          }).catch((error)=>{
              console.log(error.message);
          });
      }
    } catch(error){
      console.log(error);
    }
  }

  /*signup(){
    firebase.auth().createUserWithEmailAndPassword(this.account.email, this.account.password).then((result)=>{
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: this.account.name,
        photoURL: ""
      }).then(function() {
        console.log("login success");
      }).catch(function(error) {
        console.log(error.message);
      });
      var today = moment().format('YYYY-MM-DD');
      var tmpData = {
        name: this.account.name,
        uid: result.uid,
        group: this.account.group,
        password: this.account.password,
        date : today,
        playerId: this.playerId,
      };
      console.log(tmpData);
      var updates = {};
      updates['/users/' + tmpData.uid] = tmpData;
      firebase.database().ref().update(updates)
      .then(()=>{
      }).catch((error)=>{
        console.log(error.message);
      });
    })
    .catch((error)=> {
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  }*/

  getOneSignalPlayerId() {
    window["plugins"].OneSignal.getPermissionSubscriptionState((status)=> {
      status.permissionStatus.hasPrompted;
      status.permissionStatus.status;

      status.subscriptionStatus.subscribed;
      status.subscriptionStatus.userSubscriptionSetting;
      status.subscriptionStatus.pushToken;

      this.playerId = status.subscriptionStatus.userId;
      console.log(status.subscriptionStatus.userId);
  });
  }
}
