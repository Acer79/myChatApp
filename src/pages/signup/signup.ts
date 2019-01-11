import { Component } from "@angular/core";
import {
  NavController,
  LoadingController,
  ToastController,
  AlertController
} from "ionic-angular";
import { AngularFirestore } from "angularfire2/firestore";
import { User } from "../../app/app.models";
import { Observable } from 'rxjs';
import { ChatService } from "../../app/app.service";
import { Storage } from "@ionic/storage";
import { ChatsPage } from "../chats/chats";
import { appconfig } from "../../app/app.config";
import { NgForm } from "@angular/forms";
import { AuthService } from "../../services/auth";
import avatar from '../../data/avatars';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  
  //email: string;
  avatarList: any = [];
  loginForm: any = {};
  disabled: any[] = [];
  selection: any = {img: "assets/avatar/user.png"};
  
  constructor(
    public navCtrl: NavController,
    private db: AngularFirestore,
    private chatService: ChatService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private authService: AuthService,
    private alertCtrl: AlertController
  ) {}
  
  ionViewWillEnter() {
    this.avatarList = avatar; 
  }
  
  onSignup(form: NgForm) {
    this.loginForm = form;
    const loading = this.loadingCtrl.create({
      content: " Signing you up please wait..."
    });
    loading.present();
    
    this.authService.signup(this.loginForm.value.email, this.loginForm.value.password)
      .then(data => {
        loading.dismiss();
        this.signUpUser();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Signup failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
  
  signUpUser() {
        let myLoader = this.loadingCtrl.create({
        content: "Please wait..."
      });
      myLoader.present().then(() => {
        this.db
          .collection<User>(appconfig.users_endpoint, ref => {
            return ref.where("email", "==", this.loginForm.value.email);
          })
          .valueChanges()
          .subscribe(users => {

            if (users.length === 0) {
              //Register User

              //Add the timestamp
              this.loginForm.value.time = new Date().getTime();
              
              this.loginForm.value.avatar = this.selection.img;

              this.chatService
                .addUser(this.loginForm.value)
                .then(res => {
                  //Registration successful
                  
                  this.storage.set("chatuser", this.loginForm.value);
                  myLoader.dismiss();

                  let toast = this.toastCtrl.create({
                    message: "Login In Successful",
                    duration: 3000,
                    position: "top"
                  });
                  toast.present();

                  this.navCtrl.push(ChatsPage);
                })
                .catch(err => {
                  console.log(err);
                  myLoader.dismiss();
                });
              } 
          });
      });
  }
  
  onAvatarClick(avaSelect: string, index: number) {
    
    for(var i = 0; this.avatarList.length > i; i++) {
      if(index !== i) {
        this.disabled[i] = false;
      } else {
          this.disabled[index] = true;
          this.selection = avaSelect;
          console.log(this.selection);
          return true;
      }
    }
  }

  // loginUser() {
  //   if (this.loginForm.email != "") {
  //     //Check if email already exists
  //     let myLoader = this.loadingCtrl.create({
  //       content: "Please wait..."
  //     });
  //     myLoader.present().then(() => {
  //       this.db
  //         .collection<User>(appconfig.users_endpoint, ref => {
  //           return ref.where("email", "==", this.loginForm.email);
  //         })
  //         .valueChanges()
  //         .subscribe(users => {

  //           if (users.length === 0) {
  //             //Register User

  //             //Add the timestamp
  //             this.loginForm.time = new Date().getTime();

  //             this.chatservice
  //               .addUser(this.loginForm)
  //               .then(res => {
  //                 //Registration successful
                  
  //                 this.storage.set("chatuser", this.loginForm);
  //                 myLoader.dismiss();

  //                 let toast = this.toastCtrl.create({
  //                   message: "Login In Successful",
  //                   duration: 3000,
  //                   position: "top"
  //                 });
  //                 toast.present();

  //                 this.navCtrl.push(ChatsPage);
  //               })
  //               .catch(err => {
  //                 console.log(err);
  //                 myLoader.dismiss();
  //               });
  //           } else {
  //             //User already exists, move to chats page
              
  //             this.storage.set("chatuser", users[0]);

  //             let toast = this.toastCtrl.create({
  //               message: "Login In Successful",
  //               duration: 3000,
  //               position: "top"
  //             });
  //             toast.present();
  //             myLoader.dismiss();

  //             this.navCtrl.push(ChatsPage);
  //           }
  //         });
  //     });
  //   } else {
  //     let toast = this.toastCtrl.create({
  //       message: "Enter Email to log in",
  //       duration: 3000,
  //       position: "top"
  //     });
  //     toast.present();
  //   }
  // }

}
