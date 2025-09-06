import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

import { SelectModule } from 'primeng/select';
import { CategoryService } from '../../../services/category.service';
import { HttpClient } from '@angular/common/http';
import { FileUpload } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.html',
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    SelectModule,
    FileUpload,
    CommonModule
  ],
  styleUrls: ['./edit-product-dialog.scss']
})
export class EditProductDialog implements OnChanges {
  @Input() product: Product | null = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() isSaving = false;

  formData: Product = {} as Product;
  categories: Category[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private categoryService: CategoryService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Charger les catégories au moment du montage du composant
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.formData = { ...this.product };

      // Assigner l'ID de la catégorie dans formData.idCategory
      if (this.product.idCategory) {
        this.formData.idCategory = this.product.idCategory;  // Utilisation de idCategory
      }

      this.cdRef.detectChanges();
    }
  }

  onSave() {
    if (this.isSaving) return; // Guard to avoid duplicate clicks

    const selectedCategory = this.categories.find(category => category.id === this.formData.idCategory);
    if (selectedCategory) {
      this.formData.idCategory = selectedCategory.id;
    }

    // Émettre les données du produit avec idCategory
    this.save.emit(this.formData);
  }

  onCancel() {
    if (this.isSaving) return;
    this.cancel.emit();
    this.visibleChange.emit(false);
  }

  onImageUpload(event: any) {
    const file: File = event.files[0];
    console.log('Uploading file:', file);
    const formData = new FormData();
    formData.append('file', file);

    this.http.post<{ url: string }>('http://localhost:8080/api/files/upload', formData).subscribe({
      next: (res) => {
        this.formData.image_url = res.url;
      },
      error: (err) => console.error('Image upload failed', err)
    });
  }
}
