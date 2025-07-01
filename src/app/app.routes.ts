import { Routes } from '@angular/router';
import { Products } from './products/products';
import { Orders } from './orders/orders';


export const routes: Routes = [
    { path: 'products', component: Products },
    { path: 'orders', component: Orders}
];
