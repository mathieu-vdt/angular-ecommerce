import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { EditProductDialog } from './edit-product-dialog/edit-product-dialog';
import { DataViewModule } from 'primeng/dataview';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Card } from 'primeng/card';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  standalone: true,
  selector: 'app-products',
  imports: [
    RouterOutlet, Panel, TableModule, CommonModule,
    Button, InputTextModule, FormsModule, DialogModule,
    ButtonModule, EditProductDialog, DataViewModule,
    SelectButtonModule, ConfirmDialogModule, Card
  ],
  providers: [ConfirmationService],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class Products implements OnInit {
  protected title = 'back-office';
  layout: 'list' | 'grid' = 'grid';

  options = [
    { label: 'List', value: 'list', icon: 'pi pi-bars' },
    { label: 'Grid', value: 'grid', icon: 'pi pi-table' }
  ];

  categories: Category[] = [];
  selectedCategories: any[] = [];
  products: Product[] = [];
  selectedProduct: Product | null = null;
  editDialogVisible = false;

  // State
  isSaving = false;
  isDeleting: Record<number, boolean> = {};

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategoriesAndProducts();
  }

  loadCategoriesAndProducts(): void {
    // charger catégories d'abord (si tu veux enrichir les produits)
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories = cats;
        this.productService.getAll().subscribe({
          next: (data) => {
            this.products = data.map(product => ({
              ...product,
              category: this.categories.find(c => c.id === product.idCategory)
            }));
          },
          error: err => {
            console.error('Failed to load products', err);
          }
        });
      },
      error: err => {
        console.error('Failed to load categories', err);
      }
    });
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.editDialogVisible = true;
  }

  onProductSaved(updatedProduct: Product) {
  this.isSaving = true;

  const isEdit = !!updatedProduct.id && updatedProduct.id !== 0;

  const save$ = isEdit
  ? this.productService.update(updatedProduct.id!, updatedProduct)
  : this.productService.create({
      name: updatedProduct.name,
      description: updatedProduct.description,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      idCategory: updatedProduct.idCategory,
      image_url: updatedProduct.image_url
    });


  save$.subscribe({
    next: (saved) => {
      const withCategory = {
        ...saved,
        category: this.categories.find(c => c.id === saved.idCategory)
      } as Product & { category?: Category };

      if (isEdit) {
        // replace
        this.products = this.products.map(p => (p.id === saved.id ? withCategory : p));
      } else {
        // append (new product)
        this.products = [withCategory, ...this.products];
      }

      this.cdRef.detectChanges();
      this.editDialogVisible = false;
      this.selectedProduct = null;
    },
    error: (err) => {
      console.error(isEdit ? 'Failed to update product' : 'Failed to create product', err);
    },
    complete: () => {
      this.isSaving = false;
    }
  });
}


  confirmDelete(product: any) {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this product?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
      accept: () => this.deleteProduct(product)
    });
  }

  deleteProduct(product: Product) {
    if (!product?.id) return;

    this.isDeleting[product.id] = true;

    this.productService.delete(product.id).subscribe({
      next: () => {
        this.products = this.products.filter(p => p.id !== product.id);
        this.cdRef.detectChanges();
      },
      error: (err) => {
        console.error('Failed to delete product', err);
      },
      complete: () => {
        if (product.id !== undefined) {
          this.isDeleting[product.id] = false;
        }
      }
    });
  }

  newProduct() {
    this.selectedProduct = {
      id: 0 as any,
      name: '',
      price: 0,
      stock: 0,
      description: undefined,
      image_url: undefined,
      idCategory: this.categories[0]?.id ?? undefined
    } as Product;

    this.editDialogVisible = true;
  }

}
