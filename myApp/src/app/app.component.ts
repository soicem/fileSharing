import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';

import {LoginPage} from "../pages/login/login"


// Initialize Firebase
var config = {
  apiKey: "AIzaSyCh377VQZpitPnjnSDPurbIm-6wFbGjmIQ",
  authDomain: "modular-edge-147810.firebaseapp.com",
  databaseURL: "https://modular-edge-147810.firebaseio.com",
  projectId: "modular-edge-147810",
  storageBucket: "modular-edge-147810.appspot.com",
  messagingSenderId: "409651671842"
};
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,) {
    platform.ready().then(() => {
      var notificationOpenedCallback = function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
  
      window["plugins"].OneSignal
        .startInit("af470c88-251c-4553-a57d-0f9de339576e", "409651671842")
        .handleNotificationOpened(notificationOpenedCallback)
        .endInit();
      firebase.initializeApp(config);
      firebase.auth().onAuthStateChanged((user)=> {
        if (user) { // local storage saved
          this.rootPage = HomePage;
        } else {
          this.rootPage = LoginPage;
        }
      });
      statusBar.styleDefault();
      splashScreen.hide();  
    });
  }
}

