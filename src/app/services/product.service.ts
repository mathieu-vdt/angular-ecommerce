// src/app/services/product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = `http://localhost:8080/api/products`;

  constructor(private http: HttpClient) {}

  // Récupère tous les produits
  getAll(): Observable<Product[]> {
    return this.http.get<any>(this.baseUrl).pipe(
      map(res => {
        // si res est déjà un tableau, le retourner tel quel
        if (Array.isArray(res)) return res as Product[];
        // si res.content existe (Page), retourner content
        if (res && Array.isArray(res.content)) return res.content as Product[];
        // fallback: tenter de deviner un champ qui contient les données
        return res?.data ?? []; // si tu utilises { data: [...] } ailleurs
      }),
      catchError(err => {
        console.error('ProductService.getAll error', err);
        return throwError(() => err);
      })
    );
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('ProductService.getById error', err);
        return throwError(() => err);
      })
    );
  }

  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      catchError(err => {
        console.error('ProductService.create error', err);
        return throwError(() => err);
      })
    );
  }

  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product).pipe(
      catchError(err => {
        console.error('ProductService.update error', err);
        return throwError(() => err);
      })
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(err => {
        console.error('ProductService.delete error', err);
        return throwError(() => err);
      })
    );
  }
}
