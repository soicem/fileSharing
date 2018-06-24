import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import {SignupPage} from '../../pages/signup/signup';
import * as firebase from 'firebase';

import { LoaderProvider } from '../../providers/loader/loader'

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private account:any={
    email :'',
    password :''
  }
  constructor(public navCtrl: NavController, 
    private loader :LoaderProvider, 
    private alertCtrl :AlertController,
    private loadingCtrl :LoadingController,
    public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  /*private loading:any;
  show(){
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    this.loading.present();
  
  } 

  hide(){
    this.loading.dismiss();
  }*/

  login(){
    this.loader.show();
    firebase.auth().signInWithEmailAndPassword(this.account.email, this.account.password)
    .then((result)=>{
      console.log(result);
    })
    .catch(function(error) {
      // Handle Errors here.
      //var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
      // ...
    });
    this.loader.hide();
  }
  signup(){
    //page move : push, put
    this.navCtrl.push(SignupPage);
  }

  

  resetEmail(){
    let alert = this.alertCtrl.create({
      title: 'Reset password',
      message: "패스워드 재설정 링크를 받을 이메일 주소를 입력하여주시기 바랍니다.",
      inputs: [
        {
          name: 'email',
          placeholder: 'email'
        },
        
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'check',
          handler: data => {
            var auth = firebase.auth();
            var emailAddress = data.email;

            auth.sendPasswordResetEmail(emailAddress).then(()=> {
              // Email sent.
              let alert = this.alertCtrl.create({
                title: 'Password Reset email',
                subTitle: 'Reset email is sent to your email.  check please.',
                buttons: ['check']
              });
              alert.present();
            }).catch(function(error) {
              // An error happened.
            });
          }
        }
      ]
    });
    alert.present();

    
  }
}
