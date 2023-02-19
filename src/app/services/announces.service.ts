import {Injectable} from '@angular/core';
import {Announce} from '../interfaces/announce';
import {BehaviorSubject, Observable} from "rxjs";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {AngularFireStorage} from "@angular/fire/compat/storage";
import {off} from "@angular/fire/database";

@Injectable({
  providedIn: 'root'
})
export class AnnouncesService {
  announces : Announce[]  = [];
  constructor(
    private db : AngularFireDatabase,
    private storage : AngularFireStorage
  ) {
    //this.getAnnouncesOn();
  }
  /*
  {
      id: 1,
      brand: 'BMW',
      model: 'X5',
      description : 'Black Panther - Limited Edition',
      price: 150000,
    },
   */

  announcesSubject: BehaviorSubject<Announce[]> = new BehaviorSubject(<Announce[]>[]);

  dispatchAnnounces() {
    this.announcesSubject.next(this.announces);
  }

  getAnnounces() : void {
    this.db.list('announces').query.limitToLast(10).once('value', (snapshot) => {
      const announces = snapshot.val();
      this.announces = announces ?  Object.keys(announces).map(id => ({id, ...announces[id]})) : [];
      this.dispatchAnnounces();
    }).then(r => console.log(r)).catch(e => console.error(e))
  }

  getAnnouncesOn(): void {
    this.db.list('announces').query.limitToLast(10).on('value', (snapshot) => {
      console.log(snapshot);
      const announces = snapshot.val();
      this.announces = Object.keys(announces).map(id => ({id, ...announces[id]}));
      console.log(this.announces);
    })
  }

  async createAnnounce(announce: Announce, announcePhoto?: any) : Promise<Announce> {
    try {
      const photoUrl = announcePhoto ? await this.uploadImage(announcePhoto) : '';
      const response = this.db.list('announces').push({...announce, photo: photoUrl});
      const createdAnnounce = {...announce, photo: photoUrl, id: <string>response.key};
      this.announces.push(createdAnnounce);
      this.dispatchAnnounces();
      return createdAnnounce;
    } catch (error) {
      throw error;
    }


  }

  async editAnnounce(announce: Announce, announceId: string, newAnnouncePhoto?: any) : Promise<Announce> {
    try {
      if (newAnnouncePhoto && announce.photo && announce.photo !== '') {
        await this.removePhoto(announce.photo);
      }
      if (newAnnouncePhoto) {
        announce.photo = await this.uploadImage(newAnnouncePhoto);
      }
      await this.db.list('announces').update(announceId, announce);
      const announceIndex = this.announces.findIndex(announce => announce.id === announceId);
      this.announces[announceIndex] = {...announce, id: announceId};

      return {...announce, id: announceId};
    }catch (error) {
      throw error;
    }

  }

  async deleteAnnounce(announceId: string | undefined) : Promise<Announce> {
    try {
      const index = this.announces.findIndex(announce => announce.id === announceId);
      const offerToDelete = this.announces[index];
      if (offerToDelete.photo && offerToDelete.photo.length > 0) {
        await this.removePhoto(offerToDelete.photo);
      }
      await this.db.list(('announces')).remove(announceId);
      this.announces.splice(index, 1);
      this.dispatchAnnounces();
      return offerToDelete;
    }catch (e) {
      throw e;
    }
  }
  private uploadImage(photo: File) : Promise<string> {
  return new Promise((resolve, reject) => {
        const announces = 'offers/';
        const upload = this.storage.upload(announces+Date.now()+'-'+photo.name, photo);
        upload.then(res => {
          resolve(res.ref.getDownloadURL().then(url => url));
        }).catch(reject)
      })
  }
  private removePhoto(photoUrl: string) : Promise<void> {
    return new Promise((resolve, reject) => {
      this.storage.storage.refFromURL(photoUrl).delete().then(resolve).catch(reject)
    })
  }



  getAnnouncesPromise(): Promise<Announce[]> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (this.announces.length > 0) {
          resolve(this.announces);
        }else
          reject(new Error('No announces'));
      }, 3000);
    })
  }
  getAnnouncesObservable() : Observable<Announce[]> {
    return new Observable((observer) => {
      setInterval(() => {
        if (this.announces.length > 0) {
          observer.next(this.announces);
          //observer.complete();
        }else{
          observer.error(new Error('No announces'));
        }
      }, 1000);
    })
  }


}
