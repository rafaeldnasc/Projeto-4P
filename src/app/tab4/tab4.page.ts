import { Component, OnInit } from '@angular/core';

// IMPORTAR MÓDULOS ESSENCIAIS ↓↓↓
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
    CommonModule,
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

  ngOnInit() {
    this.carregarRanking();
  }

  // 🔥 Função separada melhora legibilidade e manutenção
  carregarRanking() {
    this.rankingService.getRanking().subscribe({
      next: (data) => {
        console.log("Dados recebidos:", data);
        this.ranking = data;
      },
      error: (err) => {
        console.error("Erro ao buscar ranking:", err);

        // Aqui você pode usar o ToastController depois
        // this.toastService.error("Não foi possível carregar o ranking.");
      },
      complete: () => {
        console.log("Busca de ranking finalizada.");
      }
    });
  }

}
