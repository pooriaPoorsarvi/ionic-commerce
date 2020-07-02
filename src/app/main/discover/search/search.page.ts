import { ProductInterface } from './../product/product.service';
import { SearchService } from './search.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  items: ProductInterface[] = [];

  constructor(
    private searchService: SearchService
  ) { }

  ngOnInit() {
    this.items = this.searchService.getCurrentSearchedProducts();
    this.searchService.getSearchedProductsStream().subscribe(
      items => this.items = items
    );
  }

  searchChanged(event): void {
    this.searchService.searchForProduct(event.detail.value);
  }

}
