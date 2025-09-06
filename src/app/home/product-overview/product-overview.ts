import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { switchMap, of } from 'rxjs';

import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';

import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms'; 
import { InputNumberModule } from 'primeng/inputnumber';
import { AccordionModule } from 'primeng/accordion';

import { CardModule } from 'primeng/card';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';


@Component({
  standalone: true,
  selector: 'app-product-overview-page',
  imports: [
    CommonModule, RouterModule, ImageModule,
    ButtonModule, InputNumberModule, AccordionModule,
    FormsModule, CardModule, Toast, Navbar, Footer
  ],
  providers: [MessageService],
  templateUrl: './product-overview.html',
  styleUrls: ['./product-overview.scss']
})
export class ProductOverview {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private messageService = inject(MessageService);

  product: Product | null = null;
  category: Category | null = null;

  qty = 1;
  loading = true;
  notFound = false;

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        if (!id) return of(null);
        this.loading = true;
        this.notFound = false;
        this.product = null;
        this.category = null;
        return this.productService.getById(id);
      })
    ).subscribe({
      next: (p) => {
        if (!p) {
          this.loading = false;
          this.notFound = true;
          return;
        }
        this.product = p;

        // Charger la catégorie
        if (p.idCategory) {
          this.categoryService.getById(p.idCategory).subscribe({
            next: (c) => { this.category = c; this.loading = false; },
            error: () => { this.loading = false; }
          });
        } else {
          this.loading = false;
        }
      },
      error: () => {
        this.loading = false;
        this.notFound = true;
      }
    });
  }

  addToCart() {
    if (!this.product) return;
    // TODO: branche ton CartService ici
    this.messageService.add({ severity: 'success', summary: 'Added to Cart', detail: `${this.product.name} x${this.qty}` });
  }
}
