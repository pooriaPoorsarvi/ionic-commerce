import { RequestSenderService } from './../../shared/request-sender.service';
import { environment } from './../../../../environments/environment';
import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Subject } from 'rxjs';

export interface ProductInterface {
  description: string;
  id: number;
  imgSrc: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(
    private httpClient: HttpClient,
    private requestSenderService: RequestSenderService,
  ) { }



  getProduct(ID: string): Subject<ProductInterface> {
    return this.requestSenderService.makeRequest(
      () => {
        return this.httpClient.get(environment.apiUrl + '/products/' + ID, {headers:{'Access-Control-Allow-Origin' : '*'}});
      },
      (res) => {},
      (err) => {
        console.log('error occured while retrieving product : ');
        console.log(err);
      },
      5000,
      'Loading product from server.',
      ProductService.name + this.getProduct.name,
    ) as Subject<ProductInterface>;
  }

}
