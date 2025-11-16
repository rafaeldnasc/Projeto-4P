import { inject } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';

export const authGuard = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  return authState(auth).pipe(
    map(user => {
      if (user) {
        // usuário logado → permitir acesso
        return true;
      } else {
        // usuário não logado → mandar para login
        router.navigateByUrl('/login', { replaceUrl: true });
        return false;
      }
    })
  );
};