import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { FileItem } from '../models/file-item';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class UploaderService {

  private IMAGE_FOLDER = 'img';
  constructor(private db: AngularFirestore) { }

  private saveImage(image: any) {
    this.db.collection(`/${this.IMAGE_FOLDER}`)
          .add(image);
  }
s
  public loadImagesFirebase(imagenes: FileItem[]) {

    const storageRef = firebase.storage().ref();

    for (const item of imagenes) {
      item.isUploading = true;
      if (item.progress >= 100) {
        continue;
      }
      const uploadTask: firebase.storage.UploadTask = 
          storageRef.child(`${this.IMAGE_FOLDER}/${item.fileName}`)
          .put(item.file);
      uploadTask.on (firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => item.progress = (snapshot.bytesTransferred) / snapshot.totalBytes * 100,
        (error) => console.log('Error al subir', error),
        () => {
          console.log('Saved !! ');

          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            item.url = downloadURL;

            this.saveImage({
              name: item.fileName,
              url: item.url
            });
          });
          item.isUploading = false;

        });

    }
  }
}
