import { Component } from '@angular/core';
import { App, ModalController, Platform, NavParams, NavController, ViewController } from 'ionic-angular';
import { SharedService } from '../../app/shared.service';
import { Http, Response } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { LoadingController } from 'ionic-angular';
import { InFlightsPage } from '../inflights/inflights';
import { PrebookingPage } from '../prebooking/prebooking';


@Component({
  selector: 'ticket-modal',
  templateUrl: 'ticketModal.html'
})
export class TicketModal {

  ticket: any;
  route: any;
  parameters:{};
  hideFooter:any;
  
  constructor(public appCtrl: App, public loadingCtrl: LoadingController,private myService: SharedService, public platform: Platform, public params: NavParams, public navCtrl: NavController, public viewCtrl: ViewController,private http: Http) {
  	this.initializeItems();
  }

  initializeItems() {
    let val = this.params.data;
    this.ticket = val.ticket;
    this.route = val.route;
    this.hideFooter = val.hideFooter;
  }

  allocate(){
  	let ticket = this.ticket;

    let loading = this.loadingCtrl.create({
      content: 'Yükleniyor...'
    });

    loading.present();

    this.parameters = {
    	SessionId : this.myService.getValue('SessionId'),
    	SessionToken : this.myService.getValue('SessionToken'),
    	token:'androidapp',
    	outFlight : ticket.ProductId,
    	TicketType: ticket.TicketType
    };

    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' });
    let options = new RequestOptions({ headers: headers });

    let searchParameters = this.myService.getValue('searchParameters');

      if(this.route == 'out'){
        this.myService.setValue('outFlight', ticket);
      }

      if(searchParameters.returnDate && searchParameters.directFlight === false && this.route == 'out' && ticket.TicketType == 'Local'){
        this.dismiss();
        loading.dismiss();
        this.appCtrl.getRootNav().push(InFlightsPage,{});
      }else{

        if(this.route == 'in'){
          let ticket = this.ticket;
          this.myService.setValue('inFlight', ticket);

          let outTicketVal = this.myService.getValue('outFlight');
          this.parameters['outFlight'] = outTicketVal.ProductId;
          this.parameters['inFlight'] = ticket.ProductId;
        }

       this.http.post('http://test.biletkolay.net/ticket/allocate.json', this.myService.serializeData(this.parameters), options)
                       .map(response => response.json())
                       .subscribe(
                         Result => {
                           this.dismiss();
                           if(Result.Error === false){
                             

                             this.myService.setValue('ProductIds',Result.Data.AllocateResult.LastAllocatedProductIds.guid);
              								var paxRefs = Result.Data.AllocateResult.ShoppingFile.AirBookings.T_AirBooking;
              								this.myService.setValue('PaxReferences', paxRefs[0].BookingItems.T_AirBookingItem);

                              var TotalAmount = 0;
                              TotalAmount += this.sum(paxRefs[0].BookingItems.T_AirBookingItem);

              								if(paxRefs.length > 1){
              									this.myService.setValue('PaxReferences2', paxRefs[1].BookingItems.T_AirBookingItem);
                                TotalAmount += this.sum(paxRefs[1].BookingItems.T_AirBookingItem);
              								}

                              this.myService.setValue('OriginalAmount', TotalAmount);
                              this.myService.setValue('TotalAmount', TotalAmount);


                             this.appCtrl.getRootNav().push(PrebookingPage,{});


                           }

                           loading.dismiss();
                         },
                         error => {
                           this.dismiss();
                           loading.dismiss();
                         }
                       )
    

    }

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
