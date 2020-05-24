import { IonSlides } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'],
})
export class AuthenticatedComponent implements OnInit {

// TODO if this make things slow, change the components into pages

  @ViewChild(IonSlides, {static: true}) slide: IonSlides;

  accountDetail = 'account-detail';
  orders = 'orders';
  options: string[] = [this.accountDetail, this.orders];

  segment = this.options[0];


  constructor() { }

  ngOnInit() {}



  // TODO remove the repetition of the segment change in authetichated and authenticate componenets
  segmentChange(event: CustomEvent<SegmentChangeEventDetail>) {
    this.segment = event.detail.value;
    this.slide.slideTo(this.options.indexOf(this.segment));
  }

  slideDragged(){
    this.slide.getActiveIndex().then(
      (index) => {
        this.segment = this.options[index];
      }
    );
  }


}
