import { Component } from '@angular/core';
import { IonContent, IonAvatar, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { DarkToggleComponent } from '../components/dark-mode/dark-mode.component';


@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [IonContent, IonAvatar, IonButton, DarkToggleComponent],
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page {
  // --- propriedades usadas no template ---
  name: string = 'Jogador';
  email: string = '';
  avatar: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';

  totalGames: number = 0;      // declarações importantes
  victories: number = 0;
  currentStreak: number = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // observa o usuário autenticado
    this.authService.user$.subscribe(async (user) => {
      if (!user) {
        // opcional: limpar dados
        this.email = '';
        this.name = 'Jogador';
        return;
      }

      this.email = user.email ?? '';
      this.avatar = user.photoURL ?? this.avatar;

      // Busca dados no Firestore através do AuthService
      try {
        const data = await this.authService.getUserData(user.uid);
        if (data) {
          this.name = data['name'] ?? this.name;
          this.totalGames = data['totalGames'] ?? 0;
          this.victories = data['victories'] ?? 0;
          this.currentStreak = data['currentStreak'] ?? 0;
        }
      } catch (err) {
        console.error('Erro ao buscar dados do usuário:', err);
      }
    });
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }
}
