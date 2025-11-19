import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ImageUploadService {

  private storage = inject(Storage);
  private firestore = inject(Firestore);

  async uploadUserImage(file: File, uid: string): Promise<string> {

    const compressed = await this.compressImage(file, 0.2, 800);

    const filePath = `users/${uid}/avatar_${Date.now()}.jpg`;
    const fileRef = ref(this.storage, filePath);

    await uploadBytes(fileRef, compressed);

    const url = await getDownloadURL(fileRef);

    const userRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(userRef, { avatar: url });

    return url;
  }

  private compressImage(file: File, quality: number, maxWidth: number): Promise<Blob> {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e: any) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        const scale = maxWidth / img.width;
        const width = img.width > maxWidth ? maxWidth : img.width;
        const height = img.width > maxWidth ? img.height * scale : img.height;

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => resolve(blob!),
          'image/jpeg',
          quality
        );
      };

      reader.readAsDataURL(file);
    });
  }
}
