import { Component,OnInit } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../../shared/services/auth.service';
import { User } from 'firebase/auth';


@Component({
  selector: 'nav-bar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navBar.html',
  styleUrl: './navBar.css'
})
export class NavBarComponent  implements OnInit {
  isLoggedIn = false; 
  constructor(private authService: AuthService, private router: Router) {}

   ngOnInit() {
    this.authService.onAuthChange((user : User | null )=> {
      this.isLoggedIn = !!user;
    });
  }

  logout() {
  this.authService.logout()
    .then(() => this.router.navigate(['/login']));
}


}
