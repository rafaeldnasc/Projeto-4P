import { Component, OnInit } from '@angular/core';

// IMPORTAR ISSO ↓↓↓
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonAvatar
} from '@ionic/angular/standalone';

import { RankingService } from '../services/ranking.service';

@Component({
  selector: 'app-tab4',
  standalone: true,
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],

  // IMPORTANTE ↓↓↓
  imports: [
    CommonModule,       // habilita *ngFor, *ngIf
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonAvatar
  ]
})
export class Tab4Page implements OnInit {

  ranking: any[] = [];

  constructor(private rankingService: RankingService) {}

 // tab4.page.ts
ngOnInit() {
  this.rankingService.getRanking().subscribe({
    next: (data) => {
      console.log("dados recebidos:", data);
      this.ranking = data;
    },
    error: (err) => {
      // ESTE É O PONTO CRÍTICO: CAPTURAR O ERRO
      console.error("Erro ao buscar ranking:", err);
    },
    complete: () => {
      console.log("Busca de ranking completa.");
    }
  });
}

}
