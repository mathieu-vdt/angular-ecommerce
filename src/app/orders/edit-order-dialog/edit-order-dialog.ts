import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  standalone: true,
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.html',
   imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule
  ],
  styleUrls: ['./edit-order-dialog.scss']
})
export class EditOrderDialog implements OnChanges {
  @Input() order: any = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  formData: any = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['order'] && this.order) {
      this.formData = { ...this.order }; // Clone pour ne pas modifier directement l'original
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
