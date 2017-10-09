import { Component, Pipe } from '@angular/core';
import { ModalController, Platform, NavParams,NavController, ViewController } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { NgFor } from '@angular/common';
import 'rxjs/add/operator/map';
import { LoadingController, ActionSheetController  } from 'ionic-angular';

import { TicketModal } from '../modal/ticketModal';
import { PrebookingPage } from '../prebooking/prebooking';


@Component({
  selector: 'page-outfligts',
  templateUrl: 'outflights.html'
})
export class OutFlightsPage {

  tickets: any[];
  OutFlights :any[];
  parameters :any;
  SortField:any;
  progress:any;

  passengerTypes = [
  {
    code: 'ADT',
    name: 'Yetişkin',
    formname: 'Yetiskin'
  },
  {
    code: 'CHD',
    name: 'Çocuk',
    formname: 'Cocuk'
  },
  {
    code: 'INF',
    name: 'Bebek',
    formname: 'Bebek'
  },
  {
    code: 'SRC',
    name: 'Yaşlı',
    formname: 'Yasli'
  },
  {
    code: 'STD',
    name: 'Öğrenci',
    formname: 'Ogrenci'
  },
  {
    code: 'MIL',
    name: 'Asker',
    formname: 'Asker'
  }
];


  constructor(public loadingCtrl: LoadingController, private myService: SharedService, public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {
    this.parameters = navParams.data;
    this.getTickets();
    this.SortField = 'NetFare';
  }


  getTickets(){
    this.progress = true;
    let loading = this.loadingCtrl.create({
      content: 'Yükleniyor...'
    });

    loading.present();

    var paxCount = 1;
    var selectedPassengers = [{
      code: 'ADT',
      name: 'Yetişkin',
      formname: 'Yetiskin'
    }];  

    for (let passenger of this.passengerTypes) {
      
        var item = passenger;
        var itemvalue = Number(this.parameters[item.formname]) ? Number(this.parameters[item.formname]) : 0;

        if ((item.code != 'ADT' && itemvalue > 0) || (item.code == 'ADT' && itemvalue > 1)) {

          this.parameters[item.formname] = itemvalue;

          if (item.code == 'ADT' && itemvalue > 1) {

            selectedPassengers[0].name = '1.' + selectedPassengers[0].name;

          }

          for (var i = 1; i <= itemvalue; i++) {

            if (item.code != 'ADT' || (item.code == 'ADT' && i > 1)) {

              var pushdata = item;
              pushdata.name = (itemvalue > 1) ? (i + '.' + pushdata.name) : pushdata.name;
              selectedPassengers.push(pushdata);
              paxCount += 1;

            }

          }

        }

    }

    this.myService.setValue('passengers' , selectedPassengers);
    this.myService.setValue('paxCount' , paxCount);

    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

     this.http.post('http://test.biletkolay.net/ticket/search.json', this.myService.serializeData(this.parameters), options)
                     .map(response => response.json())
                     .subscribe(
                       data => {
                         if(data.Tickets){
                           this.OutFlights = data.Tickets.OutFlights;
                           this.progress = false;
                           this.myService.setValue('InFlights' , data.Tickets.InFlights);
                           
                           this.myService.setValue('SessionId' , data.SessionId);
                           this.myService.setValue('SessionToken' , data.SessionToken);
                         }

                         loading.dismiss();
                       },
                       error => {
                         this.OutFlights = [];
                         this.progress = false;
                         loading.dismiss();
                       }
                     )

  }


  ticketModal(ticket, route) {
    let values = {};
    values['ticket'] = ticket;
    values['route'] = route;
    let modal = this.modalCtrl.create(TicketModal,values);
    modal.present();
  }

  sortActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
     title: 'Sırala',
     buttons: [
       {
         text: 'Fiyata göre',
         handler: () => {
           this.SortField = 'NetFare';
         }
       },
       {
         text: 'Kalkış zamanına göre',
         handler: () => {
           this.SortField = 'DepartureTime';
         }
       },
       {
         text: 'Havayoluna göre',
         handler: () => {
           this.SortField = 'OperatingAirlineName';
         }
       },
       {
         text: 'Vazgeç',
         role: 'cancel',
         handler: () => {
           
         }
       }
     ]
   });

   actionSheet.present();
 }


}



