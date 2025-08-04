import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = [
    { id: 1, username: 'admin', password: 'admin', role: 'admin', email: 'john.doe@example.com', created_at: new Date() },
    { id: 2, username: 'jane_smith', password: 'password123', role: 'customer', email: 'jane.smith@example.com', created_at: new Date() },
    { id: 3, username: 'alice_williams', password: 'password123', role: 'customer', email: 'alice.williams@example.com', created_at: new Date() },
  ];

  constructor() {}

  getUsers(): Observable<User[]> {
    return of(this.users);
  }

  getUserById(id: number): Observable<User> {
    const user = this.users.find((u) => u.id === id);
    return of(user!);
  }

  deleteUser(id: number): Observable<void> {
    this.users = this.users.filter((u) => u.id !== id);
    return of();
  }
}
