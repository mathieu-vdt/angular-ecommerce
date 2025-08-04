import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Orders } from './orders/orders';
import { Users } from './users/users';


export const routes: Routes = [
    { path: 'users', component: Users },
    { path: 'products', component: Products },
    { path: 'orders', component: Orders}
];
