// ranking.service.ts (CÓDIGO CORRIGIDO)

import { Injectable, inject } from '@angular/core';
import { 
  Firestore, 
  collection, 
  collectionData, 
  query // <--- 1. ESTA IMPORTAÇÃO É ESSENCIAL
} from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class RankingService {

  private firestore = inject(Firestore);

  getRanking() {
    const usersRef = collection(this.firestore, 'users');
    
    // 2. É NECESSÁRIO ENVOLVER A REFERÊNCIA DA COLEÇÃO NA FUNÇÃO 'query'
    const queryRef = query(usersRef); 
    
    // 3. collectionData deve receber a queryRef, não a usersRef
    return collectionData(queryRef, { idField: 'id' });
  }
}

