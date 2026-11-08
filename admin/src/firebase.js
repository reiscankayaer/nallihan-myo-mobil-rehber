/*
Web istemcisinin yapılandırmasıdır. apiKey bir servis hesabı
anahtarı değildir. Firebase bu değeri tarayıcı kodunda bekler.
Yazma yetkisi Authentication oturumu ve Firestore kurallarındadır.
Analytics başlatılmaz. measurementId yalnızca yapılandırmada durur.
*/
import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBtF1cRTxdOsr8y2JTW_kkTtD3RKeCuzM4',
  authDomain: 'nallihan-myo-rehber.firebaseapp.com',
  projectId: 'nallihan-myo-rehber',
  storageBucket: 'nallihan-myo-rehber.firebasestorage.app',
  messagingSenderId: '93374553807',
  appId: '1:93374553807:web:b5e49d47b55b5b092b21ba',
  measurementId: 'G-YF72SMRB1Q',
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
