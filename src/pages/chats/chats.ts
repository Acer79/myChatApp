import { Component, OnInit } from "@angular/core";
import { IonicPage, NavController, NavParams, AlertController } from "ionic-angular";
import { AngularFirestore } from "angularfire2/firestore";
import { Storage } from "@ionic/storage";
import { appconfig } from "../../app/app.config";
import { User } from "../../app/app.models";

import { ChatService } from "../../app/app.service";
import { ChatroomPage } from "../chatroom/chatroom";
import { AuthService } from "../../services/auth";
import { HomePage } from "../home/home";


@IonicPage()
@Component({
  selector: "page-chats",
  templateUrl: "chats.html"
})
export class ChatsPage {
  availableusers: any = [];
  chatuser;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private db: AngularFirestore,
    private storage: Storage,
    private chatService: ChatService,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}

  ionViewDidEnter() {
    //Fetch other users

    this.storage.get("chatuser").then(chatuser => {
      this.chatuser = chatuser;

      this.db
        .collection<User>(appconfig.users_endpoint)
        .valueChanges()
        .subscribe(users => {
          this.availableusers = users;
          console.log(users);
          this.availableusers = users.filter(user => {
            if (user.email != chatuser.email) {
              console.log(user);
              return user;
            }
          });
        });
    });
  }

  goToChat(chatpartner) {
    this.chatService.currentChatPairId = this.chatService.createPairId(
      this.chatuser,
      chatpartner
    );

    this.chatService.currentChatPartner = chatpartner;

    this.navCtrl.push(ChatroomPage);
  } //goToChat
  
  onLogout(event: MouseEvent) {
    
      let alert = this.alertCtrl.create({
        title: 'Confirm Logout',
        message: 'Are you sure you want to Logout?',
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Yes',
            handler: () => {
              console.log('Yes clicked');
              this.authService.logout();
              this.navCtrl.push(HomePage);
            }
          }
        ]
      });
      alert.present();
    }
  
}
