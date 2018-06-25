import { Component, PlatformRef } from '@angular/core';
import { NavController, AlertController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import * as firebase from 'firebase';
import { File } from '@ionic-native/file';
import {FileTransfer, FileUploadOptions, FileTransferObject} from '@ionic-native/file-transfer';
import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import * as moment from 'moment';
import { DISABLED } from '@angular/forms/src/model';

//https://github.com/disusered/cordova-safe/issues/19
//import { FileEncryption} from '@ionic-native/file-encryption';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  private pushMessage: any;
  private pushMode : any;
  private userName: any;
  private userEmail: any;
  private userId: any;
  private userPlayerId: any;
  private playerName: any;
  private dirPath: any;
  private nativePath: any;
  private userProfile: any;

  private email:any;
  private emailWithoutAddr:any;

  private menus = [
    {
      title: "사용자 관리",
      subTitle: "User Management",
      id: "001"
    },
    {
      title: "로그 관리",
      subTitle: "Log Management",
      id: "002"
    },
    {
      title: "받은 파일 관리",
      subTitle: "Recieved File Management",
      id: "003"
    },
    {
      title: "저장된 파일 관리",
      subTitle: "Saved File Management",
      id: "004"
    },
  ];


  constructor(public navCtrl: NavController,
    private fileChooser: FileChooser,
    private file: File,
    private filePath: FilePath,
    private transfer:FileTransfer,
    private alertCtrl: AlertController,
    private actionsheetCtrl: ActionSheetController,
    private platfrom: Platform,
    private modalCtrl: ModalController,
    //private fileEncryption : FileEncryption
  ) {

    this.initPage();
  }

  clickMenu(menu){
    if(menu.id === "001"){
      this.navCtrl.push("UsersPage");
    } else if(menu.id ==="002"){
      this.navCtrl.push("SendMessagePage"); 
    } else if(menu.id ==="003"){
      this.navCtrl.push("ReceivedFilePage");
    } else if(menu.id ==="004"){
      this.navCtrl.push("SavedFilePage");
    }
  }

  initDir() {
    let result = this.file.createDir(this.file.externalRootDirectory, this.userName, true);

    this.file.checkDir(this.file.externalRootDirectory, this.userName).then((data) => {
      this.dirPath = this.file.externalRootDirectory + this.userName;
      //alert(this.dirPath);
    }).catch(error => {
      result.then(data => {
        this.dirPath = data.toURL();
      }).catch(error => {
        this.dirPath = this.file.externalRootDirectory + this.userName;

        //alert("error" + error);
      })

    })
  }

  initPage() {
    var user = firebase.auth().currentUser;
    console.log(user);
    if (user) {
      this.userEmail = user.email;
      this.userId = user.uid;
      this.userName = this.userEmail.substring(0, this.userEmail.indexOf("@"));
      var userRef = firebase.database().ref('users/' + this.userId);
      userRef.on('value', (snapshot) => {
        if (snapshot.val()) {
          this.userProfile = {
            name: snapshot.val().name,
            uid: snapshot.val().uid,
            email: snapshot.val().email,
            password: snapshot.val().password,
            group: snapshot.val().group,
            date: snapshot.val().date,
            playerId: snapshot.val().playerId
          }
          console.log('user profile');
          console.log(this.userProfile);
        }
      });
      //alert(this.userName);
      this.initDir();
    } else {
      // No user is signed in.
    }
  }
  logout() {

    const confirm = this.alertCtrl.create({
      title: 'Log out ',
      message: 'log out?',
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Agree',
          handler: () => {
            firebase.auth().signOut().then(() => {
              console.log("log out");
            }).catch(function (error) {
              console.log("log out error");
            });
          }
        }
      ]
    });
    confirm.present();

  }

  /*fileEncrypt(path){
    console.log("fileEncryption routine start : " + path);
    let key = "soicem";
    this.fileEncryption.encrypt(path, key)
    .then(encryptedFile=>{
      console.log('Encrypted file : ' + encryptedFile);
      this.fileEncryption.decrypt(encryptedFile, key)
      .then(decryptedFile =>{
        console.log('Decrypted File : ' + decryptedFile);
      })
      .catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });

  }*/

  choose(dbDir) {
    this.fileChooser.open().then((uri) => {
      this.file.resolveLocalFilesystemUrl(uri).then((newUrl) => {
        console.log(JSON.stringify(newUrl));
        let fileNativePath = newUrl.nativeURL;
        this.filePath.resolveNativePath(fileNativePath)
        .then(resolvedFilePath => {
          console.log(resolvedFilePath);
          let dirPathSegments = resolvedFilePath.split('/')
          let name = dirPathSegments.pop()
          let resolvedDirPath = dirPathSegments.join('/');
          resolvedDirPath = resolvedDirPath + "/";
          console.log(resolvedDirPath + name);
          //this.fileEncrypt(resolvedDirPath + name);
          this.file.readAsArrayBuffer(resolvedDirPath, name).then(async (buffer) => {
            console.log(buffer);
            await this.upload(dbDir, buffer, name);
          }).catch((error) => {
            alert("read:" + JSON.stringify(error));
          });
        });   
      })

    })
  }
  async upload(dbDir, buffer, name) {
    //alert(name);
    let blob = new Blob([buffer], { type: "" });

    let storage = firebase.storage();
    this.emailWithoutAddr = this.email.substring(0, this.email.indexOf("@"));
    storage.ref(this.pushMode + "/" + this.emailWithoutAddr + "/"  + name).put(blob).then((d) => {
      var newPostKey = firebase.database().ref().child("savedFile/" + this.pushMode + "/" + this.emailWithoutAddr + "/").push().key;
      var today = moment().format('YYYY-MM-DD:HH:mm:SS');
      var tmpData = {
        //key : newPostKey,
        location : this.pushMode + "/" + this.emailWithoutAddr, //dbDir,
        fileName : name,
        fileType : "None",
        pushMode: this.pushMode,
        date : today,
      };
      console.log(tmpData);
      var updates = {};
      updates['savedFile/' + this.pushMode + "/" + this.emailWithoutAddr + "/" +newPostKey] = tmpData;
      firebase.database().ref().update(updates)
      .then(()=>{
        let alert = this.alertCtrl.create({
          title: "push message",
          message: "success",
          buttons: ["confirm"]
        });
        alert.present();
      }).catch((error)=>{
          console.log(error.message);
      });
      
      
      console.log("done");
    }).catch((error) => {
      alert(JSON.stringify(error));
    })
  }
  download() {
    let storage = firebase.storage();
    let imgRef = storage.ref('private/soicem/20180605_114926.jpg');
    imgRef.getDownloadURL().then((url) => {
      const fileTransfer: FileTransferObject = this.transfer.create();
      console.log(this.dirPath);
      // Where to store files : https://github.com/apache/cordova-plugin-file
      fileTransfer.download(url, this.dirPath + '/20180605_114926.jpg')
        .then((entry) => {
          alert(this.dirPath);
          console.log('download complete: ' + entry.toURL());
        }, (error) => {
          // handle error
        });

    })

  }

  // SEND_FILE button callback
  selectTarget() {
  
    let actionSheet = this.actionsheetCtrl.create({
      title: '전달 대상을 선택하세요',
      cssClass: 'action-sheets-basic-page',
      buttons: [
        {
          text: 'Send All',
          role: 'destructive',
         
          icon: !this.platfrom.is('ios') ? 'people' : null,
          handler: () => {
            //this.sendMessageAll();
            // not implemented yet
          }
        },
        {
          text: 'Send Group',
          role: 'destructive',
          icon: !this.platfrom.is('ios') ? 'person-add' : null,
          handler: () => {
            //this.sendMessageGroup();
            // not implemented yet
          }
        },
        {
          text: 'Send Private',
          icon: !this.platfrom.is('ios') ? 'person' : null,
          handler: () => {
            this.sendMessagePrivate();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel', // will always sort to be on the bottom
          icon: !this.platfrom.is('ios') ? 'close' : null,
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  sendMessageAll(){
    let confirm = this.alertCtrl.create({
      title: 'send message all?',
      message: this.pushMessage,
      buttons: [
        {
          text: 'Disagree',
          handler: () => {
            
          }
        },
        {
          text: 'Agree',
          handler: () => {
            console.log('Disagree clicked');
            var userRef = firebase.database().ref("users/");
            userRef.once('value', (items : any)=>{
              this.playerIds = [];
              if(items.val()){
                items.forEach((item)=>{
                  if(item.val().group){
                    this.playerIds.push(item.val().playerId);
                  }
                })
              } else {
                console.log("no data");
              }
            }).then(()=>{
              this.pushMode = "all";
              this.sendPushMessage(this.playerIds, this.pushMessage);
            }).catch((error)=>{

            });
          }
        }
      ]
    });
    confirm.present();
  }

  private groupName : any;
  sendMessageGroup(){
    let profileModal = this.modalCtrl.create("GroupModalPage");
    // text로 입력하면 lazy loading(in ionic3
    // app.component.ts로 작성하면 시작할 때 메모리에 모두 loading
    profileModal.onDidDismiss(data => {
      console.log("data");
      console.log(data);
      this.groupName = data.name;
      let confirm = this.alertCtrl.create({
        title: 'is correct?',
        message: this.pushMessage,
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              this.getPlayerIds(this.groupName);
              this.pushMode = "group";
              this.sendPushMessage(this.playerIds, this.pushMessage);
            }
          }
        ]
      });
      confirm.present();
    });
    profileModal.present();
  }
  private playerIds : any = [];
  getPlayerIds(groupName){
    var userRef = firebase.database().ref("users/");
    userRef.once('value', (items : any)=>{
      this.playerIds = [];
      if(items.val()){
        items.forEach((item)=>{
          if(groupName === item.val().group){
            this.playerIds.push(item.val().playerId);
          }
        })
      } else {
        console.log("no data");
      }
    }).then(()=>{
      console.log(this.pushMode);
      console.log(this.playerIds);
    }).catch((error)=>{

    });
  }
  
  sendMessagePrivate() {
    let profileModal = this.modalCtrl.create("PrivateModalPage");
    // text로 입력하면 lazy loading(in ionic3
    // app.component.ts로 작성하면 시작할 때 메모리에 모두 loading
    profileModal.onDidDismiss(data => {
      this.userPlayerId = data.playerId;
      this.playerName = data.name;
      this.email = data.email;
      let confirm = this.alertCtrl.create({
        title: 'is correct?',
        message: this.pushMessage,
        buttons: [
          {
            text: 'Disagree',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Agree',
            handler: () => {
              this.pushMode = "private";
              this.sendPushMessage(this.userPlayerId, this.pushMessage);
            }
          }
        ]
      });
      confirm.present();
    });
    profileModal.present();
  }
  sendPushMessage(playerId, message) {
    var player_ids:any = [];
    if(this.pushMode ==="private"){
      player_ids.push(playerId);
      this.choose("private/" + this.email + "/");
    } else if(this.pushMode === "group"){
      player_ids = playerId; // playerId already is array
      this.choose("group/" + this.groupName + "/");
    } else {
      player_ids = playerId;
      this.choose("all/");
    }
    
    console.log("player_ids");
    console.log(player_ids);
    window["plugins"].OneSignal.getIds((ids) => {
      var notificationObj = {
        contents: { en: message },
        include_player_ids: player_ids,
      };

      window["plugins"].OneSignal.postNotification(notificationObj,
        (successResponse) => {
          var newPostKey = firebase.database().ref().child('sendMessages').push().key;
          var today = moment().format('YYYY-MM-DD:HH:mm:SS');
          var tmpData = {
            key : newPostKey,
            senderName:this.userProfile.name,
            senderId : this.userProfile.uid,
            pushMode: this.pushMode,
            message: this.pushMessage,
            date : today,
          };
          console.log(tmpData);
          var updates = {};
          updates['sendMessages/' + tmpData.key] = tmpData;
          firebase.database().ref().update(updates)
            .then(()=>{
              let alert = this.alertCtrl.create({
                title: "push message",
                message: "success!!!!",
                buttons: ["confirm"]
              });
              alert.present();
            }).catch((error)=>{
                console.log(error.message);
            });
          },
          (failedResponse) => {
            let alert = this.alertCtrl.create({
              title: "push message",
              message: JSON.stringify(failedResponse),
              buttons: ["confirm"]
            });
            alert.present();
          }
      );
    });
  }
}
