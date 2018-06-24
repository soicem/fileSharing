import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import * as firebase from 'firebase';

import {LoginPage} from "../pages/login/login"


// Initialize Firebase
var config = {

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
        .startInit("", "")
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

