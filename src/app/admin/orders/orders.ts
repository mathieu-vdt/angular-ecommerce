import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelect } from 'primeng/multiselect';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';

import { Order } from '../../models/order.model';
import { OrderItemProduct } from '../../models/orderItem.model';
import { OrderService } from '../../services/order.service';
import { EditOrderDialog } from './edit-order-dialog/edit-order-dialog';

@Component({
  standalone: true,
  selector: 'app-orders',
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss'],
  imports: [
    RouterOutlet,
    CommonModule,
    Panel,
    TableModule,
    ButtonModule,
    InputTextModule,
    MultiSelect,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    RippleModule,
    EditOrderDialog
  ],
  providers: [ConfirmationService]
})
export class Orders implements OnInit {
  protected title = 'back-office - Orders';

  // Table data
  orders: Order[] = [];
  expandedRows: Record<number, boolean> = {};
  orderItems: { [orderId: number]: OrderItemProduct[] } = {};

  // Status filter (colonne "Status")
  status = [
    { label: 'Pending',   value: 'Pending' },
    { label: 'Shipped',   value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' }
  ];
  selectedCategories: any[] = [];

  // UI state
  loading = false;
  itemsLoading: Record<number, boolean> = {}; // chargement des items par commande
  isDeleting: Record<number, boolean> = {};

  // Edition
  selectedOrder: Order | null = null;
  editDialogVisible = false;

  constructor(
    private confirmationService: ConfirmationService,
    private orderService: OrderService,
    private cdRef: ChangeDetectorRef
  ) {}

  // ------------------------------------------------------------------
  // Lifecycle
  // ------------------------------------------------------------------
  ngOnInit(): void {
    this.loadOrders();
  }

  // ------------------------------------------------------------------
  // Data loading
  // ------------------------------------------------------------------
  loadOrders(): void {
    this.loading = true;
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders || [];
      },
      error: (err) => {
        console.error('Failed to load orders', err);
      },
      complete: () => {
        this.loading = false;
        this.cdRef.detectChanges();
      }
    });
  }

  /** Chargé à l’expansion de la ligne (lazy) */
  loadOrderItems(orderId: number): void {
    if (!orderId) return;
    if (this.orderItems[orderId]) return; // déjà en cache

    this.itemsLoading[orderId] = true;
    this.orderService.getItemsOrder(orderId).subscribe({
      next: (items) => {
        this.orderItems[orderId] = items || [];
      },
      error: (err) => {
        console.error(`Failed to load items for order ${orderId}`, err);
        this.orderItems[orderId] = [];
      },
      complete: () => {
        this.itemsLoading[orderId] = false;
        this.cdRef.detectChanges();
      }
    });
  }

  onRowExpand(event: any): void {
    const order: Order = event?.data;
    if (!order?.id) return;
    this.expandedRows[order.id] = true;
    this.loadOrderItems(order.id);
  }

  // ------------------------------------------------------------------
  // Edition
  // ------------------------------------------------------------------
  editOrder(order: Order): void {
    this.selectedOrder = order;
    this.editDialogVisible = true;
  }

  onOrderSaved(updated: Order): void {
    const idx = this.orders.findIndex(o => o.id === updated.id);
    if (idx !== -1) this.orders[idx] = { ...updated };
    this.editDialogVisible = false;
    this.cdRef.detectChanges();
  }

  // ------------------------------------------------------------------
  // Delete (client-side pour l’instant)
  // ------------------------------------------------------------------
  confirmDelete(order: Order): void {
    this.confirmationService.confirm({
      message: 'Do you really want to delete this order?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonProps: { label: 'Cancel', severity: 'secondary', outlined: true },
      acceptButtonProps: { label: 'Delete', severity: 'danger' },
      accept: () => this.deleteOrder(order)
    });
  }

  deleteOrder(order: Order): void {
    if (!order?.id) return;
    this.isDeleting[order.id] = true;

    // TODO: appeler l’API quand elle existe (orderService.delete(order.id))
    this.orders = this.orders.filter(o => o.id !== order.id);

    this.isDeleting[order.id] = false;
    this.cdRef.detectChanges();
  }

  // ------------------------------------------------------------------
  // Totaux
  // ------------------------------------------------------------------
  getTotalForOrder(orderId: number): number {
    const items = this.orderItems[orderId];
    if (items && Array.isArray(items)) {
      return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
    }
    return 0;
  }

  // Table perf
  trackByOrderId = (_: number, o: Order) => o.id;
  trackByItemId = (_: number, it: OrderItemProduct) => it.id ?? `${it.name}-${it.price}-${it.quantity}`;
}
