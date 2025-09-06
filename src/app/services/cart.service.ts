import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  qty: number;
}

const LS_KEY = 'cart_v1';

@Injectable({ providedIn: 'root' })
export class CartService {
  private itemsSubject = new BehaviorSubject<CartItem[]>(this.load());
  readonly items$ = this.itemsSubject.asObservable();

  readonly count$ = this.items$.pipe(
    map(items => items.reduce((sum, it) => sum + it.qty, 0))
  );

  readonly total$ = this.items$.pipe(
    map(items => items.reduce((sum, it) => sum + it.qty * it.product.price, 0))
  );

  add(product: Product, qty = 1) {
    const items = [...this.itemsSubject.value];
    const i = items.findIndex(it => it.product.id === product.id);
    if (i >= 0) {
      items[i] = { ...items[i], qty: items[i].qty + qty };
    } else {
      items.unshift({ product, qty });
    }
    this.update(items);
  }

  remove(productId: number) {
    const items = this.itemsSubject.value.filter(it => it.product.id !== productId);
    this.update(items);
  }

  setQty(productId: number, qty: number) {
    if (qty <= 0) return this.remove(productId);
    const items = this.itemsSubject.value.map(it =>
      it.product.id === productId ? { ...it, qty } : it
    );
    this.update(items);
  }

  clear() { this.update([]); }

  private update(items: CartItem[]) {
    this.itemsSubject.next(items);
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }

  private load(): CartItem[] {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
  }
}
