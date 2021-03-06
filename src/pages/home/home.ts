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
import { SignupPage } from "../signup/signup";
import { AuthService } from "../../services/auth";

@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  //email: string;
  loginForm: any = {};
  constructor(
    public navCtrl: NavController,
    private db: AngularFirestore,
    private chatService: ChatService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {}

  ionViewWillEnter() {
    const activeUser = this.authService.getActiveUser();
    if (activeUser) {
      this.storage.get("chatuser").then(chatuser => {
      if (chatuser && chatuser.email !== "") {
        this.navCtrl.push(ChatsPage);
        }
      });
    } else {
      this.authService.logout();
    }
  }
  
  onLogin(form: NgForm) {
    this.loginForm = form;
    const loading = this.loadingCtrl.create({
      content: 'Signing you in...'
    });
    loading.present();
    this.authService.signin(form.value.email, form.value.password)
      .then(data => {
        loading.dismiss();
        this.loginUser();
      })
      .catch(error => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Signin failed!',
          message: error.message,
          buttons: ['Ok']
        });
        alert.present();
      });
  }
  
  onSignup() {
    this.navCtrl.push(SignupPage);
  }
  
    loginUser() {
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

           
              //User already exists, move to chats page
              
              this.storage.set("chatuser", users[0]);

              let toast = this.toastCtrl.create({
                message: "Login In Successful",
                duration: 3000,
                position: "top"
              });
              toast.present();
              myLoader.dismiss();

              this.navCtrl.push(ChatsPage);
          });
      });
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
