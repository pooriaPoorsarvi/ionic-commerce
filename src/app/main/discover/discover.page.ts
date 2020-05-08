import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { setInterval } from 'timers';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {

  @ViewChild(IonSlides, {static: true}) ionSlides: IonSlides;
  goingForward = true;
  // The ends : -1 : first, 0 : none, 1 : last
  endThatHasBeenReached = 0;
  slideLoopTime = 2000;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    autoHeight: true
  };

  constructor() { }

  ngOnInit() {
    setInterval(
      () => {
        this.moveSlide();
      }
      , this.slideLoopTime);
    this.ionSlides.ionSlideReachEnd.subscribe(
      () => {
        this.endThatHasBeenReached = 1;
      }
    );
    this.ionSlides.ionSlideReachStart.subscribe(
      () => {
        this.endThatHasBeenReached = -1;
      }
    );
  }

  checkDirection() {
    if (this.goingForward) {
      this.goingForward = this.endThatHasBeenReached !== 1;
    } else {
      this.goingForward = this.endThatHasBeenReached === -1;
    }
    this.endThatHasBeenReached = 0;
  }
  moveSlide() {
    this.checkDirection();
    if (this.goingForward) {
      this.ionSlides.slideNext();
    } else {
      this.ionSlides.slidePrev();
    }

  }

}
