import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  senha: string = '';

  constructor(private auth: Auth, private router: Router) {}

  async login() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.senha);
      // redireciona para tab1 após login
      await this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
    } catch (error: any) {
      console.error('Erro no login:', error);
      alert('Erro ao entrar: ' + error.message);
    }
  }

  voltarRegras() {
    this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
  }

  goToCadastro() {
  this.router.navigateByUrl('/cadastro');
}

}
