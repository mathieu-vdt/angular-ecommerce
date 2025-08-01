import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { DropdownModule } from 'primeng/dropdown';
import { CategoryService } from '../../services/category.service';

@Component({
  standalone: true,
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.html',
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    DropdownModule
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
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.categoryService.getCategories().subscribe((data) => {
      this.categories = data;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.formData = { ...this.product };
      this.formData.category = this.product.category;
      this.cdRef.detectChanges();
    }
  }

  onSave() {
    const selectedCategory = this.categories.find(category => category.id === this.formData.category.id);
    if (selectedCategory) {
      this.formData.category = selectedCategory;
    }
    this.save.emit(this.formData);
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
