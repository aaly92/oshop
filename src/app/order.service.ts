import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ShoppingCartService } from './shopping-cart.service';
import { Observable } from 'rxjs/Observable';
import { Order } from './models/order';

@Injectable()
export class OrderService {

  constructor(
    private shoppingCartService: ShoppingCartService,
    private db: AngularFireDatabase) { }

  async placeOrder(order) {
    let result = await this.db.list('/orders').push(order);
    this.shoppingCartService.clearCart()

    return result;
  }

  getAll(){
    return this.db.list("/orders").valueChanges();
  } 

  getOrderByUser(userId:string) {
    return this.db.list("/orders", ref => ref.orderByChild('userId').equalTo(userId)).valueChanges()
  }
}
