import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestaurantService {
  constructor(private db: AngularFirestore) {}

  async checkUser(userId: string):Promise<boolean> {
    let response = await this.db.collectionGroup('admins', (ref) => ref.where('userId', '==', userId))
      .get()
      .toPromise().then(snapDoc => snapDoc.docs.length);
    return (response > 0);
  }
}
