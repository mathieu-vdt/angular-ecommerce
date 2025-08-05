import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { Customer } from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin', email: 'john.doe@example.com', created_at: new Date() },
    { id: 2, username: 'jane_smith', password: 'password123', role: 'customer', email: 'jane.smith@example.com', created_at: new Date() },
    { id: 3, username: 'alice_williams', password: 'password123', role: 'customer', email: 'alice.williams@example.com', created_at: new Date() },
  ];

  private customers: Customer[] = [
    { id: 1, user_id: 1, first_name: 'John', last_name: 'Doe', email: 'john.doe@example.com', phone_number: '123-456-7890', shipping_address: '123 Elm St', billing_address: '456 Oak St', created_at: new Date() },
    { id: 2, user_id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane.smith@example.com', phone_number: '234-567-8901', shipping_address: '123 Pine St', billing_address: '789 Birch St', created_at: new Date() },
    { id: 3, user_id: 3, first_name: 'Alice', last_name: 'Williams', email: 'alice.williams@example.com', phone_number: '345-678-9012', shipping_address: '456 Maple St', billing_address: '101 Cedar St', created_at: new Date() },
  ];

  constructor() {}

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find((u) => u.id === id);
    return of(user!);
  }

  getCustomerByUserId(userId: number): Observable<Customer | null> {
    const customer = this.customers.find((c) => c.user_id === userId);
    return of(customer || null);
  }

  saveUser(user: User, customer: Customer | null): Observable<void> {
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    }

    if (customer) {
      const customerIndex = this.customers.findIndex((c) => c.user_id === customer.user_id);
      if (customerIndex !== -1) {
        this.customers[customerIndex] = customer;
      } else {
        this.customers.push(customer);
      }
    }

    return of();
  }

  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter((u) => u.id !== id);
    this.customers = this.customers.filter((c) => c.user_id !== id);
    return of();
  }
}
