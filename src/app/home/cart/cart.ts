import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CartService, CartItem } from '../../services/cart.service';
import { map, Observable } from 'rxjs';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

@Component({
  standalone: true,
  selector: 'app-cart-page',
  imports: [CommonModule, RouterModule, ButtonModule, DividerModule, CurrencyPipe, Navbar, Footer],
  templateUrl: './cart.html'
})
export class Cart {
  items$!: Observable<CartItem[]>;
  subtotal$!: Observable<number>;
  shipping$!: Observable<number>;
  tax$!: Observable<number>;
  total$!: Observable<number>;

  constructor(private cart: CartService) {
    // initialisations APRES que 'cart' soit disponible
    this.items$ = this.cart.items$;
    this.subtotal$ = this.cart.total$;

    this.shipping$ = this.subtotal$.pipe(map(t => (t >= 50 || t === 0 ? 0 : 6)));
    this.tax$      = this.subtotal$.pipe(map(t => +(t * 0.0825).toFixed(2)));
    this.total$    = this.subtotal$.pipe(
      map(sub => {
        const ship = sub >= 50 || sub === 0 ? 0 : 6;
        const tax  = +(sub * 0.0825).toFixed(2);
        return +(sub + ship + tax).toFixed(2);
      })
    );
  }

  inc(it: CartItem) { this.cart.setQty(it.product.id!, it.qty + 1); }
  dec(it: CartItem) { if (it.qty > 1) this.cart.setQty(it.product.id!, it.qty - 1); }
  remove(it: CartItem) { this.cart.remove(it.product.id!); }
  clear() { this.cart.clear(); }
  checkout() { /* TODO */ }
  trackById = (_: number, it: CartItem) => it.product.id;
}
