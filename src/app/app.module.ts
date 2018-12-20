import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { appconfig } from "./app.config";
import { ChatService } from "./app.service";
import { ChatsPage } from "../pages/chats/chats";
import { ChatroomPage } from "../pages/chatroom/chatroom";
import { SortPipe } from "../pipes/sort/sort";


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ChatsPage,
    ChatroomPage,
    SortPipe
  ],
  imports: [
    AngularFireModule.initializeApp(appconfig.firebase),
    AngularFirestoreModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ChatsPage,
    ChatroomPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ChatService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
