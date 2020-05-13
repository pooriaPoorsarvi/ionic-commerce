import { RequestSenderService } from './../../shared/request-sender.service';
import { environment } from './../../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Subject } from 'rxjs';
import { ProductInterface } from './../product/product.service';

export interface CategoryInterface {
    name: string;
    imgSrc: string;
}


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private httpClient: HttpClient, private requestSenderService: RequestSenderService) { }


  getAllCategories(): Subject<CategoryInterface[]> {
    return this.requestSenderService.makeRequest(
      () => {
        return this.httpClient.get(environment.apiUrl + '/products/discover');
      },
      (res) => {},
      (err) => {
        console.log('Loading discovery product from server had an error');
        console.log(err);
      },
      5000,
      'Loading categories from server.',
      CategoryService.name + this.getAllCategories.name,
      false,
    ) as Subject<CategoryInterface[]>;
  }

}
