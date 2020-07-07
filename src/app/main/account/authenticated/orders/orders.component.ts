import { OrdersService, OrderInterface } from './orders.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  orders: OrderInterface[] = [];

  date = new Date();

  constructor(
    private ordersService: OrdersService
  ) { }

  ngOnInit() {
    this.ordersService.getObservable().subscribe(
      (orders) => {
        this.orders = orders;
      }
    );
    this.ordersService.reloadOrders();
  }

  reloadOrders(): void {
    this.ordersService.reloadOrders();
  }

}
