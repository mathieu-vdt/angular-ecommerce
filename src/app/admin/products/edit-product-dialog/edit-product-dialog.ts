import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';

import { SelectModule } from 'primeng/select';
import { CategoryService } from '../../../services/category.service';

@Component({
  standalone: true,
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.html',
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    SelectModule
  ],
  styleUrls: ['./edit-product-dialog.scss']
})
export class EditProductDialog implements OnChanges {
  @Input() product: Product | null = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  formData: Product = {} as Product;
  categories: Category[] = [];

  constructor(
    private cdRef: ChangeDetectorRef,
    private categoryService: CategoryService  // Injecter le service
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
    const selectedCategory = this.categories.find(category => category.id === this.formData.idCategory);
    if (selectedCategory) {
      this.formData.idCategory = selectedCategory.id;
    }

    // Émettre les données du produit avec idCategory
    this.save.emit(this.formData);
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
