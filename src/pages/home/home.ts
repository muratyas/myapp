import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ModalController, Platform, AlertController} from 'ionic-angular';
import { PlacesModal } from '../modal/placesModal';
import { PassengerModal } from '../modal/passengerModal';
import { SharedService } from '../../app/shared.service';
import { OutFlightsPage } from '../outflights/outflights';
import { DatePipe } from '@angular/common'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  flightDate: String ;
  returnDate: String ;
  minDate : String ;
  maxDate : String ;
  directFlight : any;
  oneWay:any;

  totalPassenger:any;
  passengerCounts = {
        'Yetiskin': 1,
        'Cocuk': 0,
        'Bebek': 0,
        'Yasli': 0,
        'Ogrenci': 0,
        'Asker': 0
  };

  flightClasses = {
        'Economy': 'Ekonomi',
        'Business': 'Business',
        'Comfort': 'Comfort',
        'First-Class': 'First Class'
  };

  constructor(public datePipe:DatePipe, private myService: SharedService, public navCtrl: NavController,public modalCtrl: ModalController, private alertCtrl: AlertController) {
    this.myService.setValue('passengerCounts',this.passengerCounts);
    this.myService.setValue('totalPassenger',1);
    this.myService.setValue('flightClass','Economy');
    
    var totalCount = this.myService.getValue('totalPassenger');
    this.totalPassenger = totalCount ? totalCount : 1;
    var d = new Date();
    d.setDate(d.getDate() + 1);
    this.flightDate = d.toISOString();
    this.minDate = new Date().toISOString();

    var md = new Date();
    md.setDate(md.getDate() + 400);
    this.maxDate = md.toISOString();



  }


  getval(item, name ,defaultval) {
      let itemvalue = this.myService.getValue(item);
      return itemvalue ? itemvalue[name] : defaultval;
  }

  getFlightClassText() {
      let itemvalue = this.myService.getValue('flightClass');
      return this.flightClasses[itemvalue];
  }

  getTotal(defaultval) {
      let itemvalue = this.myService.getValue('totalPassenger');
      return itemvalue ? itemvalue : defaultval;
  }

  placeModal(items) {
    let modal = this.modalCtrl.create(PlacesModal,items);
    modal.present();
  }

  passengerModal() {
    let modal = this.modalCtrl.create(PassengerModal);
    modal.present();
  }

  goOutflights() {
    let flightClass = this.myService.getValue('flightClass');

    let from = this.getval('fromPlace', 'urlName','');
    let to = this.getval('toPlace', 'urlName','');

    if(!from){
      this.formAlert('Eksik bilgi','Lütfen kalkış yerini seçiniz.');
      return;
    }

    if(!to){
      this.formAlert('Eksik bilgi','Lütfen varış yerini seçiniz.');
      return;
    }
    

    var parameters =  {
      from: from,
        to: to,
        flightDate: this.datePipe.transform(this.flightDate, 'dd.MM.yyyy'),
        directFlight: (this.directFlight ? true : false) ,
        flightClass: flightClass,
        Yetiskin :1,
        token:'androidapp'
    }

    if(this.returnDate && !this.oneWay){
      parameters['returnDate'] =  this.datePipe.transform(this.returnDate, 'dd.MM.yyyy')
    }

    var passengerCounts = this.myService.getValue('passengerCounts');

    for (let passenger in passengerCounts) {
      if (this.passengerCounts[passenger] > 0) {
        parameters[passenger] = this.passengerCounts[passenger];
      }
    }
    this.myService.setValue('searchParameters',parameters);
    this.navCtrl.push(OutFlightsPage,parameters);
  }


  formAlert(title,message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Tamam']
    });
    alert.present();
  }

  editPlaceName(value) {
    let newval = value;
    newval = newval.replace(/\([^)|^tümü]*\)/, '');

    if (newval.search(',') > -1) {
      var splitVal = newval.split(',');
      newval = splitVal[1];
    }
    return newval;
  }

  

}
