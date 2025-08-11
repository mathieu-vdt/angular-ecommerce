import { Routes } from '@angular/router';
import { Users } from './users/users';
import { Products } from './products/products';
import { Orders } from './orders/orders';


export const routes: Routes = [
    { path: 'users', component: Users },
    { path: 'products', component: Products },
    { path: 'orders', component: Orders}
];

