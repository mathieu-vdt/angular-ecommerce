import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user.model';
import { Customer } from '../../models/customer.model';
import { UserService } from '../../services/user.service';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-edit-user-dialog',
  templateUrl: './edit-user-dialog.html',
  styleUrls: ['./edit-user-dialog.scss'],
  imports: [
    DialogModule,
    InputText,
    ButtonModule,
    FormsModule,
    SelectModule,
    CommonModule
  ]
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

  constructor(private userService: UserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user'] && this.user) {
      this.formData = { ...this.user };

      // Load customer data if user is a customer
      if (this.formData.role === 'customer') {
        this.userService.getCustomerByUserId(this.formData.id).subscribe((customer) => {
          if (customer) {
            this.formCustomerData = { ...customer };
          }
        });
      }
    }
  }

  onSave() {
    if (this.formData.role === 'customer') {
      const updatedUser = { ...this.formData };
      const updatedCustomer = { ...this.formCustomerData };
      
      // Save both User and Customer data
      this.userService.saveUser(updatedUser, updatedCustomer).subscribe({
        next: () => {
          this.save.emit(updatedUser);
        },
        error: (error) => {
          console.log('Error saving user and customer', error);
        },
        complete: () => {
          this.save.emit(this.formData);
        }
      });
      
    } else {
      this.userService.saveUser(this.formData, null).subscribe({
        next: () => {
        },
        error: (error) => {
          console.log('Error saving user', error);
        },
        complete: () => {
          this.save.emit(this.formData);
        }
      });
    }
  }

  onCancel() {
    this.cancel.emit();
    this.visibleChange.emit(false);
  }
}
