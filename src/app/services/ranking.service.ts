import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  query,
  orderBy
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RankingService {

  private firestore = inject(Firestore);

  getRanking() {
    const usersRef = collection(this.firestore, 'users');

    // ordenar pelo campo "points" DESC
    const queryRef = query(usersRef, orderBy('points', 'desc'));

    return collectionData(queryRef, { idField: 'id' }).pipe(
      map((data: any[]) =>
        data.sort((a, b) => (b.points || 0) - (a.points || 0)) // redundância de segurança
      )
    );
  }
}
