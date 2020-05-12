import { environment } from './../../../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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


  getProduct(ID: string): Observable<any> {
    return this.httpClient.get(environment.apiUrl + '/product/' + ID);
  }

}
