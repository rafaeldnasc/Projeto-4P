import { Injectable, inject } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

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

  async getUserData(uid: string) {
    try {
      const ref = doc(this.firestore, 'users', uid);
      const snap = await getDoc(ref);
      return snap.exists() ? snap.data() : null;
    } catch (err) {
      console.error('getUserData error', err);
      throw err;
    }
  }

  signup(name: string, email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (cred) => {

        const user = cred.user;        // <-- usuário criado
        const uid = user.uid;          // <-- uid correto

        // cria o documento no Firestore
        await setDoc(doc(this.firestore, `users/${uid}`), {
          name: name,
          email: user.email,
          totalGames: 0,
          victories: 0,
          currentStreak: 0,
          points: 0
        });

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
