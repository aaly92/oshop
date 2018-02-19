import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from 'angularfire2/database';
import { Product } from './models/products';
import 'rxjs/add/operator/take';
import { Observable } from 'rxjs/Observable';
import { ShoppingCart } from './models/shopping-cart';
import 'rxjs/add/operator/map';
import { AngularWaitBarrier } from 'blocking-proxy/built/lib/angular_wait_barrier';

@Injectable()
export class ShoppingCartService {
  isCreating: boolean = false;

  constructor(private db: AngularFireDatabase) { }

  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId = await this.getOrCreateCartId()
    return this.db.object('/shopping-carts/' + cartId ).valueChanges().map(x => new ShoppingCart( (x as any).items));
  }

  async addToCart(product: Product) { 
    this.updateItem(product, 1)
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1)
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId()
    this.db.object('/shopping-carts/'+ cartId + '/items').remove();
  }

  private create() {
    return this.db.list('/shopping-carts').push({
      dateCreated : new Date().getTime()
    });
  }

  private getItem(cartId:string, productId:string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId );
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId

    //    let result = await this.create(); (put back in later when bug is fixed)
    let result = this.db.list('/shopping-carts').push({ dateCreated: new Date().getTime() });
    localStorage.setItem('cartId', result.key);
    return result.key;
  }

  private async updateItem(product: Product, change: number) {
    let cartId = await this.getOrCreateCartId();
    let itemFirebaseObject$ = this.getItem(cartId, product.key);
    let item$ = itemFirebaseObject$.valueChanges();
    item$.take(1).subscribe(item=> {
      let quantity = (item ? (item as any).quantity : 0 || 0) + change
      if (quantity === 0 ) itemFirebaseObject$.remove();
      else 
      itemFirebaseObject$.update({
        title: product.title,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: (item ? (item as any).quantity : 0 || 0)+ change});
    })
  }
}
