import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import { App, ModalController, Platform, NavParams, NavController, ViewController, AlertController } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { Http, Response } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import { FinalizePage } from '../finalize/finalize';


@Component({
  selector: 'payment-modal',
  templateUrl: 'paymentModal.html'
})
export class PaymentModal {

  ContinueUrl: any;
  parameters:{};

  
  constructor(private sanitizer: DomSanitizer,public appCtrl: App, public loadingCtrl: LoadingController,private myService: SharedService, public platform: Platform, public params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController,private http: Http, private alertCtrl: AlertController) {
  	this.initializeItems();

    self.onmessage = (e:MessageEvent) => {
      if(e.origin.indexOf("biletkolay.net") > -1){
        if(e.data.result == 'success'){
          this.dismiss();
          this.appCtrl.getRootNav().push(FinalizePage,{});
        }else{
          
          this.formAlert('İşlem Başarısız','Lütfen kart bilgilerini kontrol ediniz.');
          this.dismiss();

          //this.appCtrl.getRootNav().push(FinalizePage,{});
        }
      }
    }

  }

  initializeItems() {
    let val = this.params.data;
    this.ContinueUrl = this.sanitizer.bypassSecurityTrustResourceUrl(val.ContinueUrl);
  }

  checkPayment() {
     //var obj = document.getElementById("paymentFrame");
     //var paymentFrame = ((<HTMLIFrameElement> obj).contentWindow || (<HTMLIFrameElement> obj).contentDocument);
     //var frameDomain = paymentFrame.location.host;
     //console.log(frameDomain);
     //if(frameDomain == 'api.biletkolay.net'){
     // this.dismiss();
     //}

  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  formAlert(title,message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Tamam']
    });
    alert.present();
  }


}
