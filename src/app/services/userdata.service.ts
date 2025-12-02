// user-data.service.ts

import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { BehaviorSubject } from 'rxjs';

const SCORE_KEY = 'total_score';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  // BehaviorSubject para que os componentes possam se inscrever e reagir a mudanças
  private _totalPoints = new BehaviorSubject<number>(0);
  public totalPoints$ = this._totalPoints.asObservable();

  constructor() {
    this.loadScore();
  }

  private async loadScore() {
    const { value } = await Preferences.get({ key: SCORE_KEY });
    const score = value ? parseInt(value, 10) : 0;
    this._totalPoints.next(score);
  }

  private async saveScore(score: number) {
    await Preferences.set({
      key: SCORE_KEY,
      value: score.toString()
    });
    this._totalPoints.next(score);
  }

  async addPoints(points: number) {
    const currentScore = this._totalPoints.getValue();
    const newScore = currentScore + points;
    await this.saveScore(newScore);
  }

  // Método síncrono para obter o valor atual (se necessário)
  get totalPoints(): number {
    return this._totalPoints.getValue();
  }

  // Se você ainda tiver os métodos addVictory e addLoss, eles devem ser removidos
  // ou refatorados para não usar persistência, se o requisito for salvar APENAS o score.
  // Se eles não usam persistência, você pode mantê-los.
  async addVictory() {
    // Lógica para vitória sem persistência, se necessário
  }

  async addLoss() {
    // Lógica para derrota sem persistência, se necessário
  }
}
