import { Component } from '@angular/core';
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

@Component({
  selector: 'app-products',
  imports: [
    RouterOutlet, Panel, TableModule, CommonModule, 
    Button, InputTextModule, FormsModule, DialogModule, 
    ButtonModule, EditProductDialog,DataViewModule, 
    SelectButtonModule, ConfirmDialogModule, Card
  ],
  providers: [ConfirmationService],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  protected title = 'back-office';
  layout: 'list' | 'grid' = 'grid';

  options = [
    { label: 'List', value: 'list', icon: 'pi pi-bars' },
    { label: 'Grid', value: 'grid', icon: 'pi pi-table' }
  ];

  products = [
    { id: 1, name: 'Blue T-Shirt', price: 29, category: 'Clothing', image: 'blue-t-shirt.jpg'},
    { id: 2, name: 'Bracelet', price: 15, category: 'Accessories', image: 'bracelet.jpg'},
    { id: 3, name: 'Blue Band', price: 79, category: 'Fitness', image: 'blue-band.jpg'},
    { id: 4, name: 'Black Watch', price: 199, category: 'Accessories', image: 'black-watch.jpg'},
    { id: 5, name: 'Bamboo Watch', price: 65, category: 'Accessories', image: 'bamboo-watch.jpg'},
    { id: 6, name: 'Bracelet', price: 15, category: 'Accessories', image: 'bracelet.jpg'},
    { id: 7, name: 'Blue T-Shirt', price: 29, category: 'Clothing', image: 'blue-t-shirt.jpg'},
    { id: 8, name: 'Blue Band', price: 79, category: 'Fitness', image: 'blue-band.jpg'},
    { id: 9, name: 'Bamboo Watch', price: 65, category: 'Accessories', image: 'bamboo-watch.jpg'},
    { id: 10, name: 'Black Watch', price: 199, category: 'Accessories', image: 'black-watch.jpg'},
  ];

  categories = [
    { label: 'Category A', value: 'Category A' },
    { label: 'Category B', value: 'Category B' },
    { label: 'Category C', value: 'Category C' }
  ];
  
  selectedCategories: any[] = [];

  selectedProduct: any = null;
  editDialogVisible: boolean = false;

  editProduct(product: any) {
    this.selectedProduct = product;
    this.editDialogVisible = true;
  }

  onProductSaved(updatedProduct: any) {
    // Met à jour la liste des produits
    const index = this.products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      this.products[index] = { ...updatedProduct };
    }
    this.editDialogVisible = false;
  }

  getSeverity(product: any) {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    }

    constructor(private confirmationService: ConfirmationService) {}
    
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
        const index = this.products.findIndex(o => o.id === product.id);
        if (index !== -1) {
          this.products.splice(index, 1);
        }
      }
}