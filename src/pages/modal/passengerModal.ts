import { Component } from '@angular/core';
import { App, ModalController, Platform, NavParams, NavController, ViewController } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'passenger-modal',
  templateUrl: 'passengerModal.html'
})

export class PassengerModal {

  ticket: any;
  parameters:{};
  passengerCounts = {
        'Yetiskin': 1,
        'Cocuk': 0,
        'Bebek': 0,
        'Yasli': 0,
        'Ogrenci': 0,
        'Asker': 0
  };
  totalPassenger = 1;

  
  constructor(public appCtrl: App, public loadingCtrl: LoadingController,private myService: SharedService, public platform: Platform, public params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController) {
  	this.initializeItems();
  }

  initializeItems() {
    this.passengerCounts = this.myService.getValue('passengerCounts');
    this.totalPassenger = this.myService.getValue('totalPassenger');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }


  addPassenger(type) {
    let count = (this.passengerCounts[type]) + 1;
    let babyCount = this.passengerCounts.Bebek;
    let adtCount = this.passengerCounts.Yetiskin;
    let total = (this.totalPassenger) + 1;

    if (total < 8) {

      if (count > 0 && babyCount > count && type == 'Yetiskin') {
        this.passengerCounts.Bebek = count;
        this.passengerCounts[type] = count;
      }

      if (count > 0 && babyCount < count && type == 'Yetiskin') {
        this.passengerCounts[type] = count;
      }

      if (adtCount < count && type == 'Bebek') {
        this.passengerCounts.Bebek = adtCount;
      }

      if (adtCount >= count && type == 'Bebek') {
        this.passengerCounts.Bebek = count;
      }

      if (type !== 'Yetiskin' && type !== 'Bebek') {
        this.passengerCounts[type] = count;
      }

    }

    this.getTotal();

  }

  removePassenger(type) {

    let count = (this.passengerCounts[type]) - 1;
    let babyCount = this.passengerCounts.Bebek;
    let adtCount = this.passengerCounts.Yetiskin;
    let total = (this.totalPassenger) - 1;

    if (total > 0) {

      if (count > 0 && babyCount >= count && type == 'Yetiskin') {
        this.passengerCounts.Bebek = count;
        this.passengerCounts[type] = count;
      }

      if (count > 0 && babyCount < count && type == 'Yetiskin') {
        this.passengerCounts[type] = count;
      }

      if (count >= 0 && adtCount < count && type == 'Bebek') {
        this.passengerCounts.Bebek = adtCount;
      }

      if (count >= 0 && adtCount > count && type == 'Bebek') {
        this.passengerCounts.Bebek = count;
      }

      if (type !== 'Yetiskin' && type !== 'Bebek') {
        this.passengerCounts[type] = count;
      }


    }

    this.getTotal();

  }

  getTotal(){
  	var sum = 0;
    for (let item in this.passengerCounts) {
      var itemVal = this.passengerCounts[item];
      sum = sum + itemVal;
    }
    this.totalPassenger = sum;
    this.myService.setValue('totalPassenger',sum);
    this.myService.setValue('passengerCounts',this.passengerCounts);
  }

  changeClass(value){
	 this.myService.setValue('flightClass',value);
  }


}
