// src/app/services/category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category.model';
import { Observable, of, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = `http://localhost:8080/api/categories`;

  // fallback static data (used if backend fails)
  private fallback: Category[] = [];

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl).pipe(
      catchError(err => {
        console.warn('CategoryService.getCategories failed, using fallback', err);
        return of(this.fallback);
      })
    );
  }
}
