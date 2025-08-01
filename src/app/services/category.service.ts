import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';  // Assurez-vous d'importer l'interface Category

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor() {}

  // Méthode pour obtenir la liste des catégories
  getCategories(): Observable<Category[]> {
    // Retourner une liste statique de catégories en utilisant `of()`
    return of([
      { id: 1, name: 'Clothing', created_at: new Date() },
      { id: 2, name: 'Accessories', created_at: new Date() },
      { id: 3, name: 'Fitness', created_at: new Date() },
      { id: 4, name: 'Books', created_at: new Date() },
      { id: 5, name: 'Electronics', created_at: new Date() }
    ]);
  }
}
