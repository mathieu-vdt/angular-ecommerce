import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Blue T-Shirt',
      description: 'A stylish blue t-shirt',
      price: 29,
      stock: 100,
      idCategory: 1,
      image_url: 'blue-t-shirt.jpg',
      created_at: new Date(),
    },
    {
      id: 2,
      name: 'Bracelet',
      description: 'A beautiful bracelet',
      price: 15,
      stock: 50,
      idCategory: 2,
      image_url: 'bracelet.jpg',
      created_at: new Date(),
    },
    {
      id: 3,
      name: 'Blue Band',
      description: 'A fitness blue band',
      price: 79,
      stock: 30,
      idCategory: 3,
      image_url: 'blue-band.jpg',
      created_at: new Date(),
    },
    {
      id: 4,
      name: 'Black Watch',
      description: 'A sleek black watch',
      price: 199,
      stock: 20,
      idCategory: 4,
      image_url: 'black-watch.jpg',
      created_at: new Date(),
    },
    {
      id: 5,
      name: 'Bamboo Watch',
      description: 'An eco-friendly bamboo watch',
      price: 65,
      stock: 15,
      idCategory: 5,
      image_url: 'bamboo-watch.jpg',
      created_at: new Date(),
    },
    {
      id: 6,
      name: 'Bracelet',
      description: 'A beautiful bracelet',
      price: 15,
      stock: 50,
      idCategory: 2,
      image_url: 'bracelet.jpg',
      created_at: new Date(),
    },
    {
      id: 7,
      name: 'Blue T-Shirt',
      description: 'A stylish blue t-shirt',
      price: 29,
      stock: 100,
      idCategory: 1,
      image_url: 'blue-t-shirt.jpg',
      created_at: new Date(),
    },
    {
      id: 8,
      name: 'Blue Band',
      description: 'A fitness blue band',
      price: 79,
      stock: 30,
      idCategory: 3,
      image_url: 'blue-band.jpg',
      created_at: new Date(),
    },
    {
      id: 9,
      name: 'Bamboo Watch',
      description: 'An eco-friendly bamboo watch',
      price: 65,
      stock: 15,
      idCategory: 5,
      image_url: 'bamboo-watch.jpg',
      created_at: new Date(),
    },
    {
      id: 10,
      name: 'Black Watch',
      description: 'A sleek black watch',
      price: 199,
      stock: 20,
      idCategory: 4,
      image_url: 'black-watch.jpg',
      created_at: new Date(),
    },
  ];

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return of(this.products);
  }

  getProductById(productId: number): Observable<Product> {
    const product = this.products.find((p) => p.id === productId);
    return product ? of(product) : throwError(() => new Error('Product not found'));
  }
}
