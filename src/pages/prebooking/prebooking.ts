import { Component , ViewChild } from '@angular/core';
import { App,Platform, NavParams, NavController, ViewController ,ModalController, ToastController, Content } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import { NgForm} from '@angular/forms';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { PaymentPage } from '../payment/payment';
import { DatePipe, DecimalPipe} from '@angular/common'
import { TicketModal } from '../modal/ticketModal';
import { PriceDetailModal } from '../modal/priceDetailModal';

@Component({
  selector: 'page-prebooking',
  templateUrl: 'prebooking.html'
})

export class PrebookingPage {

  minDate : String ;
  maxDate : String ;
  passengers: any[];
  selectedTickets: any[];
  paxCount : any;
  parameters:{};
  totalAmount:any;
  paxReferences : any[];
  passengerCount: any;
  areaCode:any;
  phone:any;
  email:any;
  formSubmitted:any;

  @ViewChild(Content) content: Content;


  constructor(public datePipe:DatePipe ,public appCtrl: App, public loadingCtrl: LoadingController, private myService: SharedService, public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl: ModalController, public toastCtrl: ToastController) {

    this.passengers = this.myService.getValue('passengers');
    this.paxCount = this.myService.getValue('paxCount');
    this.totalAmount = this.myService.getValue('TotalAmount');
    this.paxReferences = this.myService.getValue('PaxReferences');
    this.passengerCount = this.passengers.length;
    this.areaCode ='90';

    let inFlight = this.myService.getValue('inFlight');
    this.selectedTickets = [];
    this.selectedTickets[0] = this.myService.getValue('outFlight');

    if(inFlight){
      this.selectedTickets[1] = inFlight;
    }

	var d = new Date();

    d.setDate(d.getFullYear() - 100);
    this.minDate = d.toISOString();

    var md = new Date();
    this.maxDate = md.toISOString();

  }

  replace_tr(replaceString) {
    var find = ['ö', 'ç', 'ş', 'i', 'ğ', 'ü', 'ı', 'Ğ', 'Ü', 'Ş', 'İ', 'Ö', 'Ç'];
    var replace = ['o', 'c', 's', 'i', 'g', 'u', 'i', 'g', 'u', 's', 'i', 'o', 'c'];

    for (var i = 0; i < find.length; i++) {
      replaceString = replaceString.replace(find[i], replace[i]);
    }
    return replaceString;
  }

  uppercaseValue(event: any, index, name){
    let str = event.target.value;
    let newstr = this.replace_tr(str).replace(/[^a-zA-Z\s]/g, '').toUpperCase();
    event.target.value = newstr;
    this.passengers[index][name] = newstr;
  }

  prebooking(passForm: NgForm){

  if(passForm.valid) {

      let passengers = this.passengers;

      let loading = this.loadingCtrl.create({
        content: 'Yükleniyor...'
      });

      loading.present();

      this.parameters = {
        SessionId : this.myService.getValue('SessionId'),
        SessionToken : this.myService.getValue('SessionToken'),
        token:'androidapp',
        productIds: this.myService.getValue('ProductIds'),
        paxCount: this.paxCount,
        Allocate: {},
        Search : {},
        PaxReferences: this.myService.getValue('PaxReferences'),
        PaxReferences2: {}
      };


      var PaxReferences = this.myService.getValue('PaxReferences');

      for (var i = 0; i < this.paxCount; i++) {

        var passenger = this.passengers[i];

		var d = new Date(passenger.birthday);
		passenger.birthday = d.toISOString();

        this.parameters['passenger_' + i + '_birthday'] = this.datePipe.transform(passenger.birthday, 'dd/MM/yyyy');
        this.parameters['passenger_' + i + '_email'] = this.email;
        this.parameters['passenger_' + i + '_identity'] = (passenger.noIdentity) ? '12345678901' : passenger.identity;
        this.parameters['passenger_' + i + '_name'] = passenger.firstname;
        this.parameters['passenger_' + i + '_surname'] = passenger.lastname;
        this.parameters['passenger_' + i + '_gender'] = passenger.gender;
        this.parameters['passenger_' + i + '_type'] = passenger.code;
        this.parameters['passenger_' + i + '_phone'] = '+' + this.areaCode + '-' + this.phone;
        this.parameters['passenger_' + i + '_paxReferenceId'] = PaxReferences[i].PaxReference.PaxReferenceId;

      }



    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

     this.http.post('http://test.biletkolay.net/ticket/prebooking.json', this.myService.serializeData(this.parameters), options)
                     .map(response => response.json())
                     .subscribe(
                       Result => {
                         if(Result.Error === false){

                           this.myService.setValue('ShoppingFileId',Result.Data.Id);
                           this.myService.setValue('OriginalAmount',Result.Data.RemainingSum);
                           this.myService.setValue('PaymentOptions',Result.Data.PaymentOptions.PaymentInstallmentOptions.T_PaymentInstallmentOption);
                           this.myService.setValue('Passengers',Result.Data.Passengers.T_Passenger);
                           this.myService.setValue('Pnr',Result.Pnr);
                           this.myService.setValue('ExpiresAt',Result.ExpiresAt);

                           this.navCtrl.push(PaymentPage);
                         }

                         loading.dismiss();
                       },
                       error => {
                         this.presentToast('Hata oluştu.Lütfen tekrar deneyiniz.');
                         loading.dismiss();
                       }
                     )

       }else{

            this.presentToast('Lütfen bilgileri kontrol ediniz');

            let target;
            let id;

            for(let i in passForm.controls) {
              if (passForm.controls[i].invalid) {
                target = passForm.controls[i];
                id = i;
                break;
              }
            }

            if (target) {
              this.scrollTo(id);
            }


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

  focus(input){
   input.focussed = true;
  }

  blur(input){
   input.focussed = false;
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


  scrollTo(element:string) {
    let elem = document.getElementById(element);
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var top  = box.top +  scrollTop - clientTop;
    var cDim = this.content.getContentDimensions();

    var scrollOffset = Math.round(top) + cDim.scrollTop - cDim.contentTop;

    this.content.scrollTo(0, scrollOffset, 500);
  }

}



