import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
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
    private transfer:FileTransfer,
    private file: File

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

  clickForDownload(savedFile){
    console.log("savedFileName : " + savedFile.fineName);
    console.log(this.locationOfStorage);
    let storage = firebase.storage();
    let Ref = storage.ref(this.locationOfStorage + "/" + savedFile.fileName);
    Ref.getDownloadURL().then((url) => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      console.log(this.dirPath);
      // Where to store files : https://github.com/apache/cordova-plugin-file
      fileTransfer.download(url, this.dirPath + '/' + savedFile.fileName)
      .then((entry) => {
        alert('download complete: ' + entry.toURL());
        alert(this.dirPath);
        console.log('download complete: ' + entry.toURL());
      }, (error) => {
        // handle error
      });

    })
  }
}
