import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInputOtp,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonLabel,
  IonButton,
  AlertController
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { shirtOutline, trophyOutline, mapOutline } from 'ionicons/icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInputOtp,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonIcon,
    IonLabel,
    IonButton,
    CommonModule
  ]
})
export class Tab2Page {
  currentHint: string | null = null;
  userAnswer: string = '';
  correctAnswer: string = 'vasco'; // em minúsculo
  otpLength: number = 0;

  constructor(private alertController: AlertController) {
    addIcons({
      shirtOutline,
      trophyOutline,
      mapOutline
    });

    // Define o tamanho do campo OTP baseado no nome do time
    this.setOtpLength();
  }

  // Conta quantas letras o nome do time possui (sem espaços)
  setOtpLength() {
    this.otpLength = this.correctAnswer.replace(/\s+/g, '').length;
  }

  showHint(hint: string) {
    this.currentHint = hint;
  }

  // Captura o valor digitado e mantém em minúsculas
  onInputChange(event: any) {
    this.userAnswer = event.target.value?.toLowerCase() || '';
  }

  // Verifica se a resposta está correta (comparando tudo em minúsculo)
  async checkAnswer() {
    const isCorrect =
      this.userAnswer.replace(/\s+/g, '') ===
      this.correctAnswer.replace(/\s+/g, '');

    const alert = await this.alertController.create({
      header: isCorrect ? 'Parabéns! 🎉' : 'Tente novamente ⚽',
      message: isCorrect
        ? 'Você acertou o time de hoje!'
        : 'Resposta incorreta!',
      buttons: ['OK']
    });

    await alert.present();
  }
}
