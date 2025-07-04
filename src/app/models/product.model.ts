import { Category } from './category.model';

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    category: Category;
    image_url: string;
    created_at: Date;
    updated_at?: Date;
}