import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Order } from '../../../models/order.model';  // Importation de l'interface
import { SelectModule } from 'primeng/select';

@Component({
  standalone: true,
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.html',
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    SelectModule
  ],
  styleUrls: ['./edit-order-dialog.scss']
})
export class EditOrderDialog implements OnChanges {
  @Input() order: Order | null = null;  // Utilisation de l'interface Order ici
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<Order>();  // Typage de l'événement
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  formData: Order = {} as Order;  // Typage explicite

  statusOptions = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];

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
