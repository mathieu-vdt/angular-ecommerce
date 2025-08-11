import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Panel } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { EditUserDialog } from './edit-user-dialog/edit-user-dialog';

@Component({
  selector: 'app-users',
  imports: [RouterOutlet, Panel, TableModule, CommonModule, Button, InputTextModule, FormsModule, DialogModule, InputText, ButtonModule, ConfirmDialogModule, EditUserDialog],
  providers: [ConfirmationService],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class Users {
  users: User[] = [];
  expandedRows: any = {};
  selectedUser: User | null = null;

  editDialogVisible: boolean = false;

  constructor(private confirmationService: ConfirmationService, private userService: UserService) {}

  confirmDelete(user: User) {
      this.confirmationService.confirm({
        message: 'Do you really want to delete this user?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
        },
        accept: () => {
          this.deleteUser(user);
        }
      });
    }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: User[]) => {
      this.users = users;
    });
  }

  editUser(user: User) {
    this.selectedUser = user;
    this.editDialogVisible = true;
  }

  onUserSaved(updatedUser: User) {
    const index = this.users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      this.users[index] = { ...updatedUser };
    }
    this.editDialogVisible = false;
  }
  
  deleteUser(user: User): void {
    const index = this.users.findIndex(o => o.id === user.id);
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}
