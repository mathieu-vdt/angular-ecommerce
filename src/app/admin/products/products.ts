import { Component, OnInit } from '@angular/core';
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
import { ChangeDetectorRef } from '@angular/core';
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
export class Products implements OnInit{
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
  editDialogVisible: boolean = false;

  constructor(
    private productService: ProductService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef,
    private categoryService: CategoryService
  ) {}


  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data.map(product => {
        const category = this.categories.find(c => c.id === product.idCategory);
        return { ...product, category };
      });
    });
  }

  editProduct(product: any) {
    this.selectedProduct = product;
    this.editDialogVisible = true;
  }
  onProductSaved(updatedProduct: any) {
    this.products = this.products.map(product => 
    product.id === updatedProduct.id 
      ? { ...updatedProduct, category: this.categories.find(c => c.id === updatedProduct.idCategory) } 
      : product
  );
    this.cdRef.detectChanges();
    this.editDialogVisible = false;
  }
    
  confirmDelete(product: any) {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this product?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
      },
      accept: () => {
        this.deleteProduct(product);
      }
    });
  }

  deleteProduct(product: any) {
    this.products = this.products.filter(o => o.id !== product.id);
  }
}