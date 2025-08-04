import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderItem, OrderItemProduct } from '../models/orderItem.model';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
    constructor(private http: HttpClient, private productService: ProductService) {}

    orderItems: OrderItem[] = [
        { id: 1, order_id: 1, product_id: 1, quantity: 2, price: 50 },
        { id: 2, order_id: 1, product_id: 2, quantity: 1, price: 100 },
        { id: 3, order_id: 1, product_id: 3, quantity: 3, price: 30 },
        { id: 4, order_id: 2, product_id: 1, quantity: 1, price: 150 },
        { id: 5, order_id: 2, product_id: 2, quantity: 2, price: 75 },
        { id: 6, order_id: 2, product_id: 3, quantity: 4, price: 25 },
        { id: 7, order_id: 3, product_id: 1, quantity: 5, price: 40 },
        { id: 8, order_id: 3, product_id: 2, quantity: 2, price: 100 },
        { id: 9, order_id: 3, product_id: 3, quantity: 1, price: 200 },
        { id: 10, order_id: 4, product_id: 1, quantity: 3, price: 80 }
    ];

  getOrders(): Observable<Order[]> {
    // Exemple avec les produits modifiés pour utiliser idCategory
    return of([
        { id: 1, idCustomer: 1, total: 100, status: 'Pending' },
        { id: 2, idCustomer: 1, total: 150, status: 'Shipped' },
        { id: 3, idCustomer: 2, total: 200, status: 'Delivered' },
        { id: 4, idCustomer: 2, total: 250, status: 'Cancelled' },
        { id: 5, idCustomer: 2, total: 300, status: 'Pending' },
        { id: 6, idCustomer: 2, total: 350, status: 'Shipped' },
        { id: 7, idCustomer: 1, total: 400, status: 'Delivered' },
        { id: 8, idCustomer: 3, total: 450, status: 'Cancelled' },
        { id: 9, idCustomer: 3, total: 500, status: 'Pending' },
        { id: 10, idCustomer: 3, total: 550, status: 'Shipped' }
    ]);
  }

  getItemsOrder(orderId: number): Observable<OrderItemProduct[]> {
    const items = this.orderItems.filter((item) => item.order_id === orderId);

    // Utilisation de forkJoin pour attendre que tous les produits soient récupérés
    const productObservables = items.map((item) =>
      this.productService.getProductById(item.product_id)
    );

    return forkJoin(productObservables).pipe(
      // Une fois tous les produits récupérés, on ajoute la quantité et le prix
      map((products: Product[]) => {
        return products.map((product, index) => ({
          ...product,              // On garde toutes les propriétés du produit
          quantity: items[index].quantity, // On ajoute la quantité
          price: items[index].price,       // On ajoute le prix
        }));
      })
    );
  }
}
