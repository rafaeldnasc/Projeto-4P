import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ValidationService } from '../services/validation.service';
import {
  IonToast, IonContent, IonItem, IonInput, IonButton,
} from '@ionic/angular/standalone';
import {
  FormGroup, FormBuilder, Validators, ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  imports: [
    IonContent, IonItem, IonInput, IonButton, IonToast, ReactiveFormsModule, CommonModule
  ]
})
export class CadastroPage {

  @ViewChild(IonToast) toast!: IonToast;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  getMensagemErro(campo: string) {
    const control = this.form.get(campo);
    return ValidationService.getErrorMessage(control!);
  }

  async mostrarToast(msg: string, color: string = 'danger') {
    this.toast.message = msg;
    this.toast.color = color;
    this.toast.duration = 2500;
    await this.toast.present();
  }

  async cadastrar() {
    if (this.form.invalid) {
      this.mostrarToast('Preencha corretamente todos os campos.');
      return;
    }

    const { name, email, senha } = this.form.value;

    try {
      await this.authService.signup(name, email, senha);

      this.mostrarToast('Conta criada com sucesso!', 'success');
      this.router.navigateByUrl('/tab1', { replaceUrl: true });

    } catch (error: any) {
      this.mostrarToast(error.message);
    }
  }

  voltarLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  voltarRegras() {
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }
}
