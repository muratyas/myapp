import { Component, ViewChild } from '@angular/core';
import { ModalController, Platform, NavParams, ViewController} from 'ionic-angular';
import { HomePage } from '../home/home';
import { SharedService } from '../../app/shared.service';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'places-modal',
  templateUrl: 'placesModal.html'
})
export class PlacesModal {

  searchQuery: string = '';
  items: any;
  newitems:string[];
  title:any;
  progress:any;

  
  constructor(private myService: SharedService, public platform: Platform, public params: NavParams, public viewCtrl: ViewController, private http: Http) {
  	this.initializeItems();
  }

   initializeItems() {
    this.items = [];
    this.title = this.params.get('title');
  }

    getItems(ev: any) {

    this.progress = true;

    let val = ev.target.value;

    if(!val){
      this.progress = false;
      this.items = [];
      return;
    }

    this.http.get('http://test.biletkolay.net/search/autocomplete.json?token=androidapp&query='+val)
                     .map(response => response.json())
                     .subscribe(
                       
                       data => {
                       this.progress = false;
                       this.items = data.places;
                       },
                       error => {
                         this.progress = false;
                         this.items = [];
                       }
                     )


  }

  selectPlace(thisItem){
    this.myService.setValue(this.params.get('inputname') , thisItem);

    setTimeout(() => { this.dismiss()}, 100);
    
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
