import { Component, OnInit } from '@angular/core';
import { OrderService } from '../order.service';
import { Order } from '../models/order';
import { AuthService } from '../auth.service';
import 'rxjs/add/operator/switchMap'


@Component({
  selector: 'my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  orders$;

  constructor(
    private orderService: OrderService,
     private authService: AuthService) {
    this.orders$ = authService.user$.switchMap(u => orderService.getOrderByUser(u.uid));
   }
}
