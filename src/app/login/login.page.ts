import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

import {
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonToast
} from '@ionic/angular/standalone';

import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { CommonModule } from '@angular/common';
import { ValidationService } from '../services/validation.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonToast,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {

  @ViewChild(IonToast) toast!: IonToast;

  form: FormGroup;

  constructor(
    private auth: Auth,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  getErro(campo: string) {
    const control = this.form.get(campo);
    return ValidationService.getErrorMessage(control!);
  }

  async mostrarToast(msg: string, color: string = 'danger') {
    this.toast.message = msg;
    this.toast.color = color;
    this.toast.duration = 2500;
    await this.toast.present();
  }

  async login() {
    if (this.form.invalid) {
      this.mostrarToast('Preencha corretamente os campos.');
      return;
    }

    const { email, senha } = this.form.value;

    try {
      await signInWithEmailAndPassword(this.auth, email, senha);
      this.mostrarToast('Login realizado!', 'success');
      await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });

    } catch (error: any) {
      console.error('Erro no login:', error);
      this.mostrarToast(error.message);
    }
  }

  voltarRegras() {
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }

  goToCadastro() {
    this.router.navigateByUrl('/cadastro');
  }
}
