import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { Customer } from '../../models/customer.model';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.html',
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    SelectModule,
    CommonModule
  ],
  styleUrls: ['./edit-user-dialog.scss']
})
export class EditUserDialog implements OnChanges {
  @Input() user: User | null = null;
  @Input() visible: boolean = false;

  @Output() save = new EventEmitter<User>();
  @Output() cancel = new EventEmitter<void>();
  @Output() visibleChange = new EventEmitter<boolean>();

  formData: User = {} as User;
  formCustomerData: Customer = {} as Customer;

  roleOptions = [
    { label: 'Admin', value: 'admin' },
    { label: 'Customer', value: 'customer' }
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (this.user) {
      // Initialize formData for User fields
      this.formData = { ...this.user };
      
      // If the user is a customer, initialize customer fields
      if (this.formData.role === 'customer') {
        // We need to manually map User fields to Customer fields
        this.formCustomerData = {
          id: this.formData.id,
          user_id: this.formData.id,
          first_name: '',
          last_name: '',
          phone_number: '',
          shipping_address: '',
          billing_address: '',
          email: this.formData.email,
          created_at: this.formData.created_at
        };
      }
    }
  }


  onSave() {
    // If role is 'customer', merge the formData and formCustomerData into one object
    if (this.formData.role === 'customer') {
      const updatedUser = { ...this.formData, ...this.formCustomerData };
      this.save.emit(updatedUser);
    } else {
      this.save.emit(this.formData);
    }
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
