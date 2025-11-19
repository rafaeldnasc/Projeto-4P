import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, setDoc, getDoc, docData } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserStats } from '../models/user-stats'; // Importe o model

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, user => this.currentUser.next(user));
  }

  get user$() {
    return this.currentUser.asObservable();
  }

  getCurrentUser(): User | null {
    return this.currentUser.value;
  }

  // Método existente para buscar dados uma vez
  async getUserData(uid: string): Promise<UserStats | null> {
    try {
      const ref = doc(this.firestore, 'users', uid);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() as UserStats : null;
    } catch (err) {
      console.error('getUserData error', err);
      throw err;
    }
  }

  // NOVO MÉTODO: Atualizações em tempo real
  getUserDataRealtime(uid: string) {
    const userDocRef = doc(this.firestore, 'users', uid);
    return docData(userDocRef).pipe(
      map(data => {
        const userData = data as UserStats;
        return {
          name: userData?.name ?? 'Jogador',
          email: userData?.email ?? '',
          totalGames: userData?.totalGames ?? 0,
          victories: userData?.victories ?? 0,
          currentStreak: userData?.currentStreak ?? 0,
          points: userData?.points ?? 0
        } as UserStats;
      })
    );
  }

  // Método para atualizar dados específicos do usuário
  async updateUserData(uid: string, data: Partial<UserStats>) {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, data, { merge: true });
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  }

  signup(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (cred) => {
        const user = cred.user;
        const uid = user.uid;

        const initialUserStats: UserStats = {
          name: name,
          email: user.email ?? email,
          totalGames: 0,
          victories: 0,
          currentStreak: 0,
          points: 0
        };

        await setDoc(doc(this.firestore, `users/${uid}`), initialUserStats);
        return cred;
      });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }
}