import { IonSlides } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
})
export class AuthenticateComponent implements OnInit {

  @ViewChild(IonSlides, {static: true}) slide: IonSlides;

  login = 'login';
  signUp = 'sign-up';

  options: string[] = [this.login, this.signUp];

  segment = this.options[0];

  constructor() { }

  ngOnInit() {}

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
