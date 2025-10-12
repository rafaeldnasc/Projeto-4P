import { Component } from '@angular/core';
import { IonContent, IonAvatar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [ IonContent, IonAvatar, IonButton],
})
export class Tab3Page {

  N_U: string = '';
  name: string = 'Jogador';
  avatar: string = 'https://ionicframework.com/docs/img/demos/avatar.svg';
  totalGames: number = 25;
  victories: number = 18;
  currentStreak: number = 3;

  constructor() {}
      ngOnInit() {
        this.N_U = 'Rafael';
        console.log(this.N_U);
      }
      
  editProfile() {
    // Lógica simples para editar perfil
    console.log('Editar perfil');
  }
}
