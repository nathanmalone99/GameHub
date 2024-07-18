import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders: any[] = [];
  expandedOrders: boolean[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe(orders => {
      this.orders = orders;
      this.expandedOrders = new Array(orders.length).fill(false);
    });
  }

  toggleOrderDetails(index: number) {
    this.expandedOrders[index] = !this.expandedOrders[index];
  }
}
