/*
MİMARİ AÇIKLAMA
Bu dosya, öğrenci uygulamasının Firestore kapısıdır. Yapılandırma,
yönetim panelindeki admin/src/firebase.js ile aynı projedir. Böylece
panelin yazdığı duyuru, telefonun okuduğu duyurudur. Buradan yalnızca
db dışa aktarılır. Öğrenci rehberi hesap açmaz. Authentication
başlatılmaz.

NEDEN KULLANILDI?
firebase paketi mobil projede zaten vardır. getFirestore, tarayıcı ve
Expo'nun kullandığı modüler istemcidir. apiKey bir servis hesabı
anahtarı değildir. Firebase bu değeri istemci kodunda bekler. Yazma
yetkisi bu dosyada yoktur. Okuma, Firestore kuralına bağlıdır.
*/

import { getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBtF1cRTxdOsr8y2JTW_kkTtD3RKeCuzM4',
  authDomain: 'nallihan-myo-rehber.firebaseapp.com',
  projectId: 'nallihan-myo-rehber',
  storageBucket: 'nallihan-myo-rehber.firebasestorage.app',
  messagingSenderId: '93374553807',
  appId: '1:93374553807:web:b5e49d47b55b5b092b21ba',
  measurementId: 'G-YF72SMRB1Q',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);
