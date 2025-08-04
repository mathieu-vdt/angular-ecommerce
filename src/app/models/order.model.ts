export interface Order {
  id: number;
  idCustomer: number;
  total: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
}
