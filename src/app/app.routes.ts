import { Routes } from '@angular/router';
import { Admin } from './admin/admin';
import { Users } from './admin/users/users';
import { Products } from './admin/products/products';
import { Orders } from './admin/orders/orders';
import { Home } from './home/home';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'admin',
    component: Admin,
    children: [
      { path: '', component: Admin },
      { path: 'users', component: Users },
      { path: 'products', component: Products },
      { path: 'orders', component: Orders }
    ]
  }
];
