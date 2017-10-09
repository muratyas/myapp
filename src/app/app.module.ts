import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { DatePicker } from '@ionic-native/date-picker';
import { CommonModule,DatePipe } from '@angular/common'



import { MyApp } from './app.component';
import {SharedService} from './shared.service';


import { HomePage } from '../pages/home/home';
import { OutFlightsPage } from '../pages/outflights/outflights';
import { InFlightsPage } from '../pages/inflights/inflights';
import { PrebookingPage } from '../pages/prebooking/prebooking';
import { PaymentPage } from '../pages/payment/payment';
import { FinalizePage } from '../pages/finalize/finalize';


import { PlacesModal } from '../pages/modal/placesModal';
import { TicketModal } from '../pages/modal/ticketModal';
import { PaymentModal } from '../pages/modal/paymentModal';
import { PassengerModal } from '../pages/modal/passengerModal';
import { PriceDetailModal } from '../pages/modal/priceDetailModal';
import { PaymentOptionsModal } from '../pages/modal/paymentOptionsModal';

import { SortPipe } from '../pipes/sort';
import { GroupByPipe } from '../pipes/groupBy';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Keyboard } from '@ionic-native/keyboard';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    OutFlightsPage,
    InFlightsPage,
    PrebookingPage,
    PaymentPage,
    FinalizePage,
    PlacesModal,
    TicketModal,
    PaymentModal,
    PassengerModal,
    PriceDetailModal,
    PaymentOptionsModal,
    SortPipe,
    GroupByPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp,{
    backButtonText:'Geri'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    OutFlightsPage,
    InFlightsPage,
    PrebookingPage,
    PaymentPage,
    FinalizePage,
    PlacesModal,
    TicketModal,
    PaymentModal,
    PassengerModal,
    PriceDetailModal,
    PaymentOptionsModal
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Keyboard,
    Vibration,
    DatePicker,
    SharedService,
    DatePipe,
    SortPipe,
    GroupByPipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
