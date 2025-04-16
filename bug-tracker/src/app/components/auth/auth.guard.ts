import { CanActivateFn } from '@angular/router';
import { Inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = Inject(Router);
  const isLoggedin = !!localStorage.getItem('token');

  if(!isLoggedin){
    router.navigate(['/login']);
    return false;
  }
  return true;
};
