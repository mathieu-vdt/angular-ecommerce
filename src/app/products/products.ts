import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table'; // Only TableModule needed
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  imports: [RouterOutlet, Panel, TableModule, CommonModule, Button, InputTextModule, MultiSelect, FormsModule],
  templateUrl: './products.html',
  styleUrl: './products.scss'
})
export class Products {
  protected title = 'back-office';

  products = [
    { id: 1, name: 'Product 1', price: 100, category: 'Category A' },
    { id: 2, name: 'Product 2', price: 150, category: 'Category B' },
    { id: 3, name: 'Product 3', price: 200, category: 'Category A' },
    { id: 4, name: 'Product 4', price: 250, category: 'Category C' },
    { id: 5, name: 'Product 5', price: 300, category: 'Category B' },
    { id: 6, name: 'Product 6', price: 350, category: 'Category A' },
    { id: 7, name: 'Product 7', price: 400, category: 'Category C' },
    { id: 8, name: 'Product 8', price: 450, category: 'Category B' },
    { id: 9, name: 'Product 9', price: 500, category: 'Category A' },
    { id: 10, name: 'Product 10', price: 550, category: 'Category C' }
  ];

  categories = [
    { label: 'Category A', value: 'Category A' },
    { label: 'Category B', value: 'Category B' },
    { label: 'Category C', value: 'Category C' }
  ];
  
  selectedCategories: any[] = [];
}