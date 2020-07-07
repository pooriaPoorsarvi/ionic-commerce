import { Subject, Observable } from 'rxjs';
import { environment } from './../../../../../environments/environment';
import { AuthenticationService } from './../../../shared/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


export interface OrderInterface {
    id: number;
    purchaseDate: Date;
    amountPayed: number;
    address: string;
    numberOfProductPurchase: number;
}

@Injectable({providedIn: 'root'})
export class OrdersService {

    private orders: OrderInterface[] = [];
    private ordersSubject: Subject<OrderInterface[]> = new Subject<OrderInterface[]>();

    constructor(
        private httpClient: HttpClient,
        private authenticationService: AuthenticationService
    ) {}

    reloadOrders(): void {
        if (this.authenticationService.getAuthenticationModel().isExpired()) {
            throw new Error('can\'t check for orders if not logged in');
        }

        this.httpClient.get(environment.apiUrl + '/orders').subscribe(
            (result: OrderInterface[]) => {
                this.setOrders(result);
            }
        );

    }

    private setOrders(orders: OrderInterface[]): void {
        this.orders = orders;
        this.ordersSubject.next(this.orders.slice());
    }

    getObservable(): Observable<OrderInterface[]> {
        return this.ordersSubject.asObservable();
    }

}





