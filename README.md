# fileSharing

# development environment 
front : ionic3 cordova, angular JS, typescript, javascript, android
backend : firebase, oneSignal

# installation guide

0. java version must be 64bit (32bit can't be executed === gradle build problem)

1. npm install
2. ionic cordova platform add android
3. add all cordova plugin (ref : https://ionicframework.com/docs/native/)

you can realize what I install from "src/pages/home/home.ts" import plugins

ex)
$ ionic cordova plugin add cordova-safe
$ npm install --save @ionic-native/file-encryption

+ momentjs : https://momentjs.com/
+ onesignal sdk setup : https://documentation.onesignal.com/docs/ionic-sdk-setup
+ ionic cordova plugin add firebase@4.8.0 --save

made by soicem(pusan university student, kim namque 김남규)
