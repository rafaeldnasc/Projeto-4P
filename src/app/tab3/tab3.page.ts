import { Component, OnInit, OnDestroy } from '@angular/core';
import { IonContent, IonAvatar, IonButton } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { UserStats } from '../models/user-stats'; // Importe o model
import { Router } from '@angular/router';
import { DarkToggleComponent } from '../components/dark-mode/dark-mode.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab3',
  standalone: true,
  imports: [IonContent, IonAvatar, IonButton, DarkToggleComponent],
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit, OnDestroy {
  // Usando o model UserStats para tipagem
  userStats: UserStats = {
    name: 'Jogador',
    email: '',
    totalGames: 0,
    victories: 0,
    currentStreak: 0,
    points: 0
  };

  avatar: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  private userDataSubscription?: Subscription;
  private currentUserId?: string;

  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit() {
    this.setupUserListener();
  }

  ngOnDestroy() {
    // Importante: sempre cancelar a subscription
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
  }

  private setupUserListener() {
    this.authService.user$.subscribe((user) => {
      if (!user) {
        this.clearUserData();
        return;
      }

      this.currentUserId = user.uid;
      this.userStats.email = user.email ?? '';
      this.avatar = user.photoURL ?? this.avatar;

      // Cancela subscription anterior se existir
      if (this.userDataSubscription) {
        this.userDataSubscription.unsubscribe();
      }

      // Escuta mudanças em tempo real do Firestore
      this.userDataSubscription = this.authService.getUserDataRealtime(user.uid).subscribe({
        next: (data: UserStats) => {
          console.log('Dados atualizados:', data);
          this.userStats = { ...data };
        },
        error: (err) => {
          console.error('Erro ao escutar dados do usuário:', err);
        }
      });
    });
  }

  // Método para forçar atualização manual se necessário
  async refreshData() {
    if (this.currentUserId) {
      try {
        const data = await this.authService.getUserData(this.currentUserId);
        if (data) {
          this.userStats = { ...data };
        }
      } catch (err) {
        console.error('Erro ao atualizar dados:', err);
      }
    }
  }

  private clearUserData() {
    this.userStats = {
      name: 'Jogador',
      email: '',
      totalGames: 0,
      victories: 0,
      currentStreak: 0,
      points: 0
    };
    this.avatar = 'https://ionicframework.com/docs/img/demos/avatar.svg';
    this.currentUserId = undefined;
  }

  async logout() {
    try {
      await this.authService.logout();
      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (error) {
      console.error('Erro ao deslogar:', error);
    }
  }

  // Getters para o template (opcional - mantém compatibilidade)
  get name(): string { return this.userStats.name; }
  get email(): string { return this.userStats.email; }
  get totalGames(): number { return this.userStats.totalGames; }
  get victories(): number { return this.userStats.victories; }
  get currentStreak(): number { return this.userStats.currentStreak; }
  get points(): number { return this.userStats.points; }
}