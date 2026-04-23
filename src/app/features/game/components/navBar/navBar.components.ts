import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterModule],
  template: `
    <nav class="navbar">
      <a routerLink="/">Startseite</a>
      <a routerLink="/commands">Commands</a>
      <a routerLink="/profile">Profil</a>
      <a routerLink="/login">Login</a>
    </nav>
  `,
  styleUrl: './navBar.css'
})
export class NavBarComponent {}