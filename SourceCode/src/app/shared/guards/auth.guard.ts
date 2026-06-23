import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authGuard: CanActivateFn = () => {
  if (environment.skipAuthGuard) return true;

  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise((resolve) => {
    authService.onAuthChange((user) => {
      if (user) {
        resolve(true);
      } else {
        router.navigate(['/login']);
        resolve(false);
      }
    });
  });
};
