import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, NavController } from '@ionic/angular';
import { interval } from 'rxjs';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit {
  items = [1, 2, 3, 4, 5];

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
    const sub =interval(1000);
    sub.subscribe(
      () => {
        this.moveSlide();
      });
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
