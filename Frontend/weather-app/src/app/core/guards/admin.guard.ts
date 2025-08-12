import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || role !== 'admin') {
    router.navigate(['/login']);
    return false;
  } else {
    return true;
  }
};
