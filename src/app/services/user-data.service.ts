import { Injectable, inject } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { UserStats } from '../models/user-stats';

@Injectable({ providedIn: 'root' })
export class UserDataService {

  private firestore = inject(Firestore);
  private auth = inject(Auth);

  constructor() {}

  userData: UserStats | null = null;

  private get uid(): string | null {
    return this.auth.currentUser ? this.auth.currentUser.uid : null;
  }

  async createUserData(user: any) {
    if (!user?.uid) return;

    const ref = doc(this.firestore, `users/${user.uid}`);

    return setDoc(ref, {
      name: user.name,
      email: user.email,
      totalGames: 0,
      victories: 0,
      currentStreak: 0,
      points: 0
    } as UserStats);
  }

  async getData(): Promise<UserStats | null> {
    if (!this.uid) return null;

    const ref = doc(this.firestore, `users/${this.uid}`);
    const snap = await getDoc(ref);

    return snap.exists() ? (snap.data() as UserStats) : null;
  }

  async updateData(data: Partial<UserStats>) {
    if (!this.uid) {
      console.error("Usuário não logado");
      return;
    }

    const ref = doc(this.firestore, `users/${this.uid}`);
    return updateDoc(ref, data);
  }

  async addPoints(points: number) {
    const current = await this.getData();
    if (!current) return;

    return this.updateData({
      points: current.points + points
    });
  }

  async addVictory() {
    const current = await this.getData();
    if (!current) return;

    return this.updateData({
      victories: current.victories + 1,
      totalGames: current.totalGames + 1,
      currentStreak: current.currentStreak + 1
    });
  }

  async addLoss() {
    const current = await this.getData();
    if (!current) return;

    return this.updateData({
      totalGames: current.totalGames + 1,
      currentStreak: 0
    });
  }
}
