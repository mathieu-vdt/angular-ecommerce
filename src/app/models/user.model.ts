export interface User {
    id: number;
    username: string;
    password: string;
    role: 'admin' | 'customer';
    email: string;
    created_at: Date;
    updated_at?: Date;
}
