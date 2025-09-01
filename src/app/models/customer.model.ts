export interface Customer {
    id: number;
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    shipping_address: string;
    billing_address: string;
    created_at: Date;
    updated_at?: Date;
}

