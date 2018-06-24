import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
/**
 * Generated class for the SavedFilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-saved-file',
  templateUrl: 'saved-file.html',
})
export class SavedFilePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private transfer:FileTransfer,
    private file: File
  ){
      this.initPage();  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SavedFilePage');
  }
  private dirPath:any;
  private savedFiles:any;
  initPage(){
    
    var user = firebase.auth().currentUser;
    this.savedFiles = [];
    console.log(user);
    if (user) {
      let userName = user.email.substring(0, user.email.indexOf("@"));
      //let result = this.file.createDir(this.file.externalRootDirectory, userName, true);

      this.file.checkDir(this.file.externalRootDirectory, userName).then((data) => {
        this.dirPath = this.file.externalRootDirectory + userName;
        //alert(this.dirPath);
      }).catch(error => {
        console.log(error);
      })
      this.file.listDir(this.file.externalRootDirectory, userName)
      .then(list=>{
        console.log(list);
        this.savedFiles = list;
      }).catch(err=>{
        console.log(err);
      });
    }
    
  }

}
