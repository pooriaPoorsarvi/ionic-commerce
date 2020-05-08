import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit {

  items = [1, 2, 3, 4, 5];

  constructor() { }

  ngOnInit() {
  }

}
