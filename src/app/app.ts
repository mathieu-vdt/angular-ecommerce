import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Sidebar], 
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'back-office';
}