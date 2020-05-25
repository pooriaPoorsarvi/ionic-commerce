import { RequestSenderService } from './../shared/request-sender.service';
import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Subject } from 'rxjs';
import { ProductInterface } from './product/product.service';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {
  constructor(private httpClient: HttpClient, private requestSenderService: RequestSenderService) { }


  discover(): Subject<ProductInterface[]> {
    return this.requestSenderService.makeRequest(
      () => {
        return this.httpClient.get(environment.apiUrl + '/products/discover', {headers: {'Access-Control-Allow-Origin' : '*'}});
      },
      (res) => {},
      (err) => {
        console.log('Loading discovery product from server had an error');
        console.log(err);
      },
      5000,
      'Loading discovery product from server.',
      DiscoverService.name + this.discover.name,
    ) as Subject<ProductInterface[]>;
  }

}
