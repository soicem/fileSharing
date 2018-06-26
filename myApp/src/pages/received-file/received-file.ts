import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { StreamingMedia, StreamingVideoOptions, StreamingAudioOptions } from '@ionic-native/streaming-media';
import { ActionSheetController } from 'ionic-angular';

/**
 * Generated class for the ReceivedFilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-received-file',
  templateUrl: 'received-file.html',
})
export class ReceivedFilePage {
  private dirPath: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private platfrom: Platform,
    private transfer:FileTransfer,
    private file: File,
    private streamingMedia : StreamingMedia,
    private actionSheetCtrl : ActionSheetController,

  ) {
    this.initPage();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReceivedFilePage');
  }
  private storedFiles:any;
  private locationOfStorage:any;

  initPage(){
    var user = firebase.auth().currentUser;
    console.log(user);
    let userName = user.email.substring(0, user.email.indexOf("@"));
    let result = this.file.createDir(this.file.externalRootDirectory, userName, true);

    this.file.checkDir(this.file.externalRootDirectory, userName).then((data) => {
      this.dirPath = this.file.externalRootDirectory + userName;
      //alert(this.dirPath);
    }).catch(error => {
      result.then(data => {
        this.dirPath = data.toURL();
      }).catch(error => {
        this.dirPath = this.file.externalRootDirectory + userName;

        //alert("error" + error);
      })

    })

    this.storedFiles = [];
    
    if (user) {
      var userRef = firebase.database().ref('/savedFile/private/' + userName);
      userRef.once("value", (items: any)=>{
        this.storedFiles = [];
        if(items.val()){
          items.forEach((item)=>{
            this.storedFiles.push({
            fileName : item.val().fileName,
            fileType:item.val().fileType,
            date : item.val().date,
            pushMode : item.val().pushMode
            });
            this.locationOfStorage = item.val().location;
          });
          console.log(this.storedFiles);
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

  // streaming
  startVideo(videoUrl) {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Finished Video') },
      errorCallback: (e) => { console.log('Error: ', e) },
      orientation: 'portrait'
    };
 
    // http://www.sample-videos.com/
    this.streamingMedia.playVideo(videoUrl, options);
  }

  fileDownload(videoUrl, fileName){
    const fileTransfer: FileTransferObject = this.transfer.create();
      fileTransfer.download(videoUrl, this.dirPath + '/' + fileName)
      .then((entry) => {
        alert('download complete: ' + entry.toURL());
        alert(this.dirPath);
        console.log('download complete: ' + entry.toURL());
      }, (error) => {
        // handle error
      });
  }

  // Action Sheet로 streaming과 download 타입 선택을 요구한다.
  presentActionSheet(videoUrl, fileName) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Select type',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Streaming video',
          icon: !this.platfrom.is('ios') ? 'thunderstorm' : null,
          handler: () => {
            this.startVideo(videoUrl + fileName);
            console.log('video streaming clicked');
          }
        },{
          text: 'Download video',
          icon: !this.platfrom.is('ios') ? 'cloud-download' : null,
          handler: () => {
            this.fileDownload(videoUrl, fileName);
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          icon: !this.platfrom.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  
  // receivedFile에서 파일을 클릭하면 동작하며 presentAction sheet를 보인다.
  clickForDownload(savedFile){
    console.log("savedFileName : " + savedFile.fineName);
    console.log(this.locationOfStorage);
    let storage = firebase.storage();
    let Ref = storage.ref(this.locationOfStorage + "/" + savedFile.fileName);
    Ref.getDownloadURL().then((url) => {
      
      console.log(this.dirPath);
      // Where to store files : https://github.com/apache/cordova-plugin-file
      console.log(url + this.dirPath + '/'+ savedFile.fileName);
      this.presentActionSheet(url + this.dirPath + '/', savedFile.fileName);
      //this.startVideo(url + this.dirPath + '/' + savedFile.fileName);
    })
  }
}
