import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product){
    return this.db.list('/products').push(product);
  }

  update(productId, product){
    return this.db.object('/products/' + productId).update(product);
  }

  getAll() {
    return this.db.list("/products").snapshotChanges().map(changes => {
      return changes.map(c => (
        { key: c.payload.key, ...c.payload.val()
      }));
    });
  }

  delete(productId) {
    this.db.object('/products/' + productId ).remove();
  }

  get(productId) {
    return this.db.object('/products/' + productId).valueChanges();
  }
}
