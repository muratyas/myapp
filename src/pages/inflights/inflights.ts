import { Component } from '@angular/core';
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
  selector: 'page-inflights',
  templateUrl: 'inflights.html'
})
export class InFlightsPage {

  tickets: any[];
  InFlights : any[];
  parameters :any;
  SortField:any;




  constructor(public loadingCtrl: LoadingController, private myService: SharedService, public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl: ModalController, public actionSheetCtrl: ActionSheetController) {
    this.parameters = navParams.data;
    this.getTickets();
    this.SortField = 'NetFare';
  }


  getTickets(){
    let loading = this.loadingCtrl.create({
      content: 'Yükleniyor...'
    });

    loading.present();

    this.InFlights = this.myService.getValue('InFlights');

    loading.dismiss();

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
