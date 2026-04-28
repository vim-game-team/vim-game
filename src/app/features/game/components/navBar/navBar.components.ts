import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar">
      <a routerLink="/">Startseite</a>
      <a routerLink="/commands">Commands</a>
      <a routerLink="/profile">Profil</a>
      <a routerLink="/login">Login</a>
      <a routerLink="/register">Register</a>
    </nav>
  `,
  styleUrl: './navBar.css'
})
export class NavBarComponent {}
