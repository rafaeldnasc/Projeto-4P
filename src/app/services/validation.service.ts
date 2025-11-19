import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  static getErrorMessage(control: AbstractControl): string {
    if (!control || !control.errors) return '';

    const errors = control.errors;

    if (errors['required']) return 'Campo obrigatório.';
    if (errors['email']) return 'Digite um email válido.';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres.`;
    if (errors['pattern']) return 'Formato inválido.';

    return 'Campo inválido.';
  }

  static passwordMatch(control: AbstractControl) {
    const senha = control.get('senha')?.value;
    const confirmar = control.get('confirmar')?.value;

    if (senha !== confirmar) {
      control.get('confirmar')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }
}
