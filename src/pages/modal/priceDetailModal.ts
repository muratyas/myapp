import { Component } from '@angular/core';
import { App, ModalController, Platform, NavParams, NavController, ViewController } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'prices-detail-modal',
  templateUrl: 'priceDetailModal.html'
})
export class PriceDetailModal {

  prices: any;
  totalAmount:any;
  passengerTypes = {
    'ADT':'Yetişkin',
    'CHD':'Çocuk',
    'INF': 'Bebek',
    'SRC':'Yaşlı',
    'STD':'Öğrenci',
    'MIL':'Asker'
  };
  
  constructor(public appCtrl: App, private myService: SharedService, public platform: Platform, public params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController) {
  	this.initializeItems();
  }

  initializeItems() {
    let val = this.params.data;
    this.prices = val.prices;
    this.totalAmount = this.myService.getValue('TotalAmount');
  }

  sum(list) {
      var total=0;
      for (let index in list) {
        var item = list[index];
        total += parseFloat(item['TotalFare']);
      };
      return total;
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }


}
