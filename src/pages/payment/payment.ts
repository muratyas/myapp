import { Component, ViewChild } from '@angular/core';
import { App,ModalController, Platform, NavParams,NavController, ViewController, ToastController, Content} from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { NgForm} from '@angular/forms';
import { DatePipe, DecimalPipe} from '@angular/common'
import { PaymentModal } from '../modal/paymentModal';
import { TicketModal } from '../modal/ticketModal';
import { PriceDetailModal } from '../modal/priceDetailModal';
import { PaymentOptionsModal } from '../modal/paymentOptionsModal';


@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})

export class PaymentPage {


  parameters:{};
  passengers: any[];
  selectedTickets: any[];
  paxCount : any;
  totalAmount:any;
  paxReferences : any[];
  paymentOptions:any[];
  passengerCount: any;
  creditCardPattern :any;

  CardNumber:any;
  CardHolder:any;
  cv2:any;
  ExpirationYear:any;
  ExpirationMonth:any;
  wantInstallment:any;

  @ViewChild(Content) content: Content;


  constructor(public datePipe:DatePipe, public appCtrl: App, public loadingCtrl: LoadingController, private myService: SharedService, public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl: ModalController, public toastCtrl: ToastController) {
    this.passengers = this.myService.getValue('passengers');
    this.paxCount = this.myService.getValue('paxCount');
    this.totalAmount = this.myService.getValue('TotalAmount');
    this.paxReferences = this.myService.getValue('PaxReferences');
    this.paymentOptions = this.myService.getValue('PaymentOptions');
    this.passengerCount = this.passengers.length;
    this.ExpirationYear = "19";
    this.ExpirationMonth = "01";
    this.creditCardPattern = "(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\d{3})\d{11})";

    let inFlight = this.myService.getValue('inFlight');
    this.selectedTickets = [];
    this.selectedTickets[0] = this.myService.getValue('outFlight');

    if(inFlight){
      this.selectedTickets[1] = inFlight;
    }
  }




  payment(payForm: NgForm){

  if(payForm.valid) {

      let loading = this.loadingCtrl.create({
        content: 'Yükleniyor...'
      });

      loading.present();


      this.parameters = {
        SessionId : this.myService.getValue('SessionId'),
        SessionToken : this.myService.getValue('SessionToken'),
        token:'androidapp',
        CardNumber:this.CardNumber,
        CardHolder:this.CardHolder,
        ExpirationMonth:this.ExpirationMonth,
        ExpirationYear:this.ExpirationYear,
        cv2:this.cv2,    
        Bill:false,
        Purchase:'TEKCEKIM',
        ShoppingFileId: this.myService.getValue('ShoppingFileId'),
        OriginalAmount: this.myService.getValue('OriginalAmount'),
        ReturnProtocol: 'https',
        ReturnHost : 'api.biletkolay.net',
        ReturnPage:'/checkpayment/',
        HashPrefix :'',
        Allocate: {},
        Search : {},
        PaxReferences: this.myService.getValue('PaxReferences'),
        PaxReferences2: {}
      };

      if (this.wantInstallment) {

        this.parameters['Purchase'] = 'TAKSIT';
        let selectedOption = this.myService.getValue('selectedOption');

        for (let key in selectedOption) {
         let value = selectedOption[key];
           this.parameters[key] = value;
        }

      }


    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

     this.http.post('http://test.biletkolay.net/ticket/payment.json', this.myService.serializeData(this.parameters), options)
                     .map(response => response.json())
                     .subscribe(
                       Result => {
                         if(Result.Error === false){
                           this.paymentModal({ContinueUrl :Result.Data.ContinueUrl})
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

                          for(let i in payForm.controls) {
                            if (payForm.controls[i].invalid) {
                              target = payForm.controls[i];
                              id = i;
                              break;
                            }
                          }

                          if (target) {
                            this.scrollTo(id);
                          }

                   }

  }

  paymentModal(data) {
    let modal = this.modalCtrl.create(PaymentModal,data);
    modal.present();
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

  paymentOptionsModal(show) {
    if(show){
      let values = {};
      values['options'] = this.paymentOptions;
      let modal = this.modalCtrl.create(PaymentOptionsModal,values);
      modal.present();
    }
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


  replace_tr(replaceString) {
    var find = ['ö', 'ç', 'ş', 'i', 'ğ', 'ü', 'ı'];
    var replace = ['Ö', 'Ç', 'Ş', 'İ', 'Ğ', 'Ü', 'I'];

    for (var i = 0; i < find.length; i++) {
      replaceString = replaceString.replace(find[i], replace[i]);
    }
    return replaceString;
  } 

  uppercaseValue(event: any, name){
    let str = event.target.value;
    let newstr = this.replace_tr(str).replace(/[^a-zA-ZÖÇŞİIĞÜöçşiğüı\s]/g, '').toUpperCase();
    event.target.value = newstr;
    this[name] = newstr;
  }


}

