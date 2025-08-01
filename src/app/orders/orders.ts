import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { EditOrderDialog } from './edit-order-dialog/edit-order-dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Order } from '../models/order.model';  // Importation de l'interface

@Component({
  selector: 'app-orders',
  imports: [RouterOutlet, Panel, TableModule, CommonModule, Button, InputTextModule, MultiSelect, FormsModule, DialogModule, InputText, ButtonModule, EditOrderDialog, ConfirmDialogModule],
  providers: [ConfirmationService],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders {
  protected title = 'back-office - Orders';

  orders: Order[] = [  // Utilisation de l'interface Order ici
    { id: 1, customer: 'Customer 1', total: 100, status: 'Pending' },
    { id: 2, customer: 'Customer 2', total: 150, status: 'Shipped' },
    { id: 3, customer: 'Customer 3', total: 200, status: 'Delivered' },
    { id: 4, customer: 'Customer 4', total: 250, status: 'Cancelled' },
    { id: 5, customer: 'Customer 5', total: 300, status: 'Pending' },
    { id: 6, customer: 'Customer 6', total: 350, status: 'Shipped' },
    { id: 7, customer: 'Customer 7', total: 400, status: 'Delivered' },
    { id: 8, customer: 'Customer 8', total: 450, status: 'Cancelled' },
    { id: 9, customer: 'Customer 9', total: 500, status: 'Pending' },
    { id: 10, customer: 'Customer 10', total: 550, status: 'Shipped' }
  ];

  status = [
    { label: 'Pending', value: 'Pending' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ]
  
  selectedCategories: any[] = [];

  selectedOrder: Order | null = null;  // Utilisation de l'interface Order ici
  editDialogVisible: boolean = false;

  editOrder(order: Order) {
    this.selectedOrder = order;
    this.editDialogVisible = true;
  }

  onOrderSaved(updatedOrder: Order) {
    const index = this.orders.findIndex(p => p.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = { ...updatedOrder };
    }
    this.editDialogVisible = false;
  }

  constructor(private confirmationService: ConfirmationService) {}

  confirmDelete(order: Order) {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this order?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonProps: {
          label: 'Cancel',
          severity: 'secondary',
          outlined: true,
      },
      acceptButtonProps: {
          label: 'Delete',
          severity: 'danger',
      },
      accept: () => {
        this.deleteOrder(order);
      }
    });
  }

  deleteOrder(order: Order) {
    const index = this.orders.findIndex(o => o.id === order.id);
    if (index !== -1) {
      this.orders.splice(index, 1);
    }
  }
}
