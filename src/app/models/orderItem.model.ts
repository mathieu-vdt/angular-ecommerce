import { Product } from "./product.model";

export interface OrderItem {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price: number;
}


export interface OrderItemProduct extends Product {
  quantity: number;
  price: number; 
}