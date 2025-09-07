import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order } from '../models/order.model';
import { OrderItem, OrderItemProduct } from '../models/orderItem.model';
import { Product } from '../models/product.model';
import { ProductService } from './product.service';
import { Observable, of, forkJoin, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = `http://localhost:8080/api/orders`;

  private fallbackOrders: Order[] = [];
  private fallbackItems: OrderItem[] = [];

  constructor(private http: HttpClient, private productService: ProductService) {}

  // get orders list (attempt API -> fallback)
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl).pipe(
      catchError(err => {
        console.warn('OrderService.getOrders failed, using fallback', err);
        return of(this.fallbackOrders);
      })
    );
  }

  
  getItemsOrder(orderId: number): Observable<OrderItemProduct[]> {
    const remoteItemsUrl = `${this.baseUrl}/${orderId}/items`;

    return this.http.get<any>(remoteItemsUrl).pipe(
      map(response => {
        if (Array.isArray(response) && response.length > 0) {
          return response.map((r: any) => ({
            ...r
          })) as OrderItemProduct[];
        }
        return [] as OrderItemProduct[];
      }),
      catchError(() => {
        const items = this.fallbackItems.filter(it => it.order_id === orderId);
        if (!items || items.length === 0) {
          return of([] as OrderItemProduct[]);
        }

        const productObservables = items.map(it => this.productService.getById(it.product_id).pipe(
          catchError(err => {
            console.warn('Product fetch failed for id', it.product_id, err);
            const stub: Product = {
              id: it.product_id,
              name: 'Unknown',
              price: it.price ?? 0,
              stock: 0,
              idCategory: 0,
              created_at: new Date()
            };
            return of(stub);
          })
        ));

        return forkJoin(productObservables).pipe(
          map((products: Product[]) => products.map((product, idx) => ({
            ...product,
            quantity: items[idx].quantity,
            price: items[idx].price
          }) as OrderItemProduct))
        );
      })
    );
  }
}
