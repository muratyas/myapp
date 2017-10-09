import { Component, Pipe } from '@angular/core';
import { App, ModalController, Platform, NavParams, NavController, ViewController } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import 'rxjs/add/operator/map';

import { GroupByPipe } from '../../pipes/groupBy';
import { SortPipe } from '../../pipes/sort';

@Component({
  selector: 'payment-options-modal',
  templateUrl: 'paymentOptionsModal.html'
})
export class PaymentOptionsModal {

  options: any;  
  
  
  constructor(public appCtrl: App, private myService: SharedService, public platform: Platform, public params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController,public groupByPipe:GroupByPipe) {
  	this.initializeItems();
  }

  initializeItems() {
    let val = this.params.data;
    if(val){
      this.options = this.groupByPipe.transform(val.options,'BankName');
    }
    
  }


  selectOption(option){
    this.myService.setValue('selectedOption',option);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }


}
