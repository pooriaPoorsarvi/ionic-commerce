import { Component, OnInit } from '@angular/core';
import {SegmentChangeEventDetail} from '@ionic/core';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss'],
})
export class AuthenticateComponent implements OnInit {

  login = 'login';
  signUp = 'sign-up';

  segment = this.login;

  constructor() { }

  ngOnInit() {}

  segmentChange(event: CustomEvent<SegmentChangeEventDetail>) {
    this.segment = event.detail.value;
  }

}
