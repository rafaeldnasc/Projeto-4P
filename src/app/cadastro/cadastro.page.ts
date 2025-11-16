import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
  imports: [IonContent, IonItem, IonInput, IonButton, FormsModule]
})
export class CadastroPage {

  email: string = '';
  senha: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async cadastrar() {
    if (!this.email || !this.senha) {
      alert('Preencha o email e a senha.');
      return;
    }

    try {
      await this.authService.signup(this.email, this.senha);

      alert('Conta criada com sucesso!');

      // redireciona para o login
      this.router.navigateByUrl('/tab1', { replaceUrl: true });

    } catch (error: any) {
      console.error(error);
      alert('Erro: ' + error.message);
    }
  }

  voltarLogin() {
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  voltarRegras() {
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }
}
