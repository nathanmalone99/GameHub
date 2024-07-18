import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from 'src/app/services/order.service';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  orders: any[] = [];
  expandedOrders: boolean[] = [];
  user$: Observable<firebase.User | null>;

  constructor(private orderService: OrderService, private authService: AuthService) {
    this.user$ = this.authService.user$;
  }

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
