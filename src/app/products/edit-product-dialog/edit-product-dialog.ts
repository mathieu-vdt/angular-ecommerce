import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Product } from '../../models/product.model';

@Component({
  standalone: true,
  selector: 'app-edit-product-dialog',
  templateUrl: './edit-product-dialog.html',
   imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule
  ],
  styleUrls: ['./edit-product-dialog.scss']
})
export class EditProductDialog implements OnChanges {
  @Input() product: Product | null = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<Product>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  formData: any = {};

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.formData = { ...this.product };
      this.cdRef.detectChanges();
    }
  }
  
  onSave() {
    this.save.emit(this.formData);
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
