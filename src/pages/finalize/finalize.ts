import { Component} from '@angular/core';
import { App,Platform, NavParams, NavController, ViewController ,ModalController, ToastController} from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { NgForm} from '@angular/forms';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { DatePipe, DecimalPipe} from '@angular/common'
import { TicketModal } from '../modal/ticketModal';
import { PriceDetailModal } from '../modal/priceDetailModal';


@Component({
  selector: 'page-finalize',
  templateUrl: 'finalize.html'
})

export class FinalizePage {


  passengers: any[];
  selectedTickets: any[];
  paxCount : any;
  parameters:{};
  totalAmount:any;
  paxReferences : any[];
  passengerCount: any;


  constructor(public datePipe:DatePipe ,public appCtrl: App, public loadingCtrl: LoadingController, private myService: SharedService, public navCtrl: NavController, public navParams: NavParams, private http: Http,public modalCtrl: ModalController, public toastCtrl: ToastController) {

    this.passengers = this.myService.getValue('passengers');
    this.paxCount = this.myService.getValue('paxCount');
    this.totalAmount = this.myService.getValue('TotalAmount');
    this.paxReferences = this.myService.getValue('PaxReferences');
    this.passengerCount = this.passengers.length;

    let inFlight = this.myService.getValue('inFlight');
    this.selectedTickets = [];
    this.selectedTickets[0] = this.myService.getValue('outFlight');

    if(inFlight){
      this.selectedTickets[1] = inFlight;
    }



  }

  


  ticketModal(ticket, route) {
    let values = {};
    values['ticket'] = ticket;
    values['route'] = route;
    values['hideFooter'] = true;
    let modal = this.modalCtrl.create(TicketModal,values);
    modal.present();
  }

  priceDetailModal(prices) {
    let values = {};
    values['prices'] = prices;
    let modal = this.modalCtrl.create(PriceDetailModal,values);
    modal.present();
  }

 
  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top',
      showCloseButton:true,
      closeButtonText:'Tamam'
    });
    toast.present();
  }


}



