import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navBar.html',
  styleUrl: './navBar.css'
})
export class NavBarComponent {
  isLoggedIn = false; // This should be replaced with actual authentication logic
}
