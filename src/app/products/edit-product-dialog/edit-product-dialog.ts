import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

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
  @Input() product: any = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  formData: any = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product'] && this.product) {
      this.formData = { ...this.product }; // Clone pour ne pas modifier directement l'original
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
