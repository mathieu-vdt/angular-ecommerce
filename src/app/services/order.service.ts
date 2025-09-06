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

  // Try to call backend endpoint /api/orders/{id}/items which should return items + product data OR raw items.
  // If backend doesn't have it, fallback to reconstructing items by fetching products via ProductService.
  getItemsOrder(orderId: number): Observable<OrderItemProduct[]> {
    const remoteItemsUrl = `${this.baseUrl}/${orderId}/items`;

    // 1) Try backend endpoint that returns items with product data (best case)
    return this.http.get<any>(remoteItemsUrl).pipe(
      // if API returns something meaningful, try to normalize it:
      map(response => {
        // if response is already array of products-with-quantity, try to adapt
        if (Array.isArray(response) && response.length > 0) {
          // If each entry already looks like a product + quantity, return as is
          // We do a best-effort mapping to OrderItemProduct interface
          return response.map((r: any) => ({
            ...r
          })) as OrderItemProduct[];
        }
        return [] as OrderItemProduct[];
      }),
      catchError(() => {
        // 2) Fallback: use local fallback items (or fetch items from server if you have an endpoint)
        const items = this.fallbackItems.filter(it => it.order_id === orderId);
        if (!items || items.length === 0) {
          return of([] as OrderItemProduct[]);
        }

        // build array of product observables
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
