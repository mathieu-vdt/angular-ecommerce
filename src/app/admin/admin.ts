import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterModule, RouterOutlet, Sidebar], 
  templateUrl: './admin.html',
  styleUrl: './admin.scss'
})
export class Admin {
  protected title = 'back-office';
}