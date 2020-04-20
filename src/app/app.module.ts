
import { NgModule ,LOCALE_ID} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';

/*Modules*/
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from '../components/components.module';

/*services*/
import { DatabaseService } from '../services/database.service';
import { DialogsService } from '../services/dialogs.service';
import { UtilsService } from '../services/utils.service';
import { EventsService } from '../services/events.service';

import { registerLocaleData } from '@angular/common';
import localeZh from '@angular/common/locales/es';

registerLocaleData(localeZh);

@NgModule({
  declarations: [AppComponent],
  entryComponents:[],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, BrowserAnimationsModule, HttpClientModule, ComponentsModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    SQLite,
    SQLitePorter,
    DatabaseService,
    DialogsService ,
    UtilsService,
    EventsService,
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  exports:[],
  bootstrap: [AppComponent]
})
export class AppModule {}
