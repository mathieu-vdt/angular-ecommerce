export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    idCategory: number;
    image_url: string;
    created_at: Date;
    updated_at?: Date;
}