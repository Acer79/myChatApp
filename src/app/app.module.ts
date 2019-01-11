import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFirestoreModule } from "angularfire2/firestore";
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
// import { EmojiPickerModule } from '@ionic-tools/emoji-picker';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { appconfig } from "./app.config";
import { ChatService } from "./app.service";
import { SignupPage } from "../pages/signup/signup";
import { ChatsPage } from "../pages/chats/chats";
import { ChatroomPage } from "../pages/chatroom/chatroom";
import { SortPipe } from "../pipes/sort/sort";
import { AuthService } from "../services/auth";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatsPage,
    ChatroomPage,
    SortPipe,
    SignupPage
  ],
  imports: [
    AngularFireModule.initializeApp(appconfig.firebase),
    AngularFirestoreModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    // EmojiPickerModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatsPage,
    ChatroomPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ChatService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AngularFireAuth,
    AuthService
  ]
})
export class AppModule {}
