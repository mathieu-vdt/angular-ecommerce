import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';
import { DataViewModule  } from 'primeng/dataview';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { ButtonModule } from 'primeng/button';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { Card } from 'primeng/card';
import { Panel } from 'primeng/panel';
import { Footer } from './footer/footer';
import { RouterLink } from '@angular/router';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    Navbar, TableModule, CommonModule, 
    InputTextModule, FormsModule, DialogModule, 
    ButtonModule, DataViewModule , RouterLink,
    SelectButtonModule,Card, Panel, Footer
  ],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit{
  protected title = 'Ecommerce Angular';

  categories: Category[] = [];
  products: Product[] = [];

  logos = [
    'assets/logos/adidas.svg',
    'assets/logos/nike.svg',
    'assets/logos/calvin_klein.svg',
    'assets/logos/gucci.svg',
    'assets/logos/rolex.png',
    'assets/logos/tommy-hilfiger.svg',
  ];

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    public cart: CartService
  ) {}

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe(products => {
      this.products = products.map(p => ({
        ...p,
        category: this.categories.find(c => c.id === p.idCategory)
      }));
    });
  }
}
