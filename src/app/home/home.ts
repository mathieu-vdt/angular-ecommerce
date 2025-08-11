import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from './navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home{
  protected title = 'Ecommerce Angular';

  logos = [
    'assets/logos/adidas.svg',
    'assets/logos/nike.svg',
    'assets/logos/calvin_klein.svg',
    'assets/logos/gucci.svg',
    'assets/logos/rolex.png',
    'assets/logos/tommy-hilfiger.svg',
  ];
}
