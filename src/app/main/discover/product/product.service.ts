import { environment } from './../../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timer, Subject } from 'rxjs';

export interface ProductInterface {
  description: string;
  id: number;
  imageSrc: string;
  name: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private httpClient: HttpClient) { }


  getProduct(ID: string): Subject<ProductInterface> {
    const res = new Subject<ProductInterface>();
    const reqRepeat = timer(0, 5000).subscribe(
      () => {
        const request = this.httpClient.get(environment.apiUrl + '/products/' + ID).subscribe(
          (result: ProductInterface) => {
            res.next(result);
            request.unsubscribe();
            reqRepeat.unsubscribe();
          },
          err => {
            console.log('error occured while retrieving product : ');
            console.log(err);
          }
        );
      }
    );
    return res;
  }

}
