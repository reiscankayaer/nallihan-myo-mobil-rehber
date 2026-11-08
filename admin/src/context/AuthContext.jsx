/*
MİMARİ AÇIKLAMA
Admin panelinin yetkisiz erişime kapanması için state yönetimi.
onAuthStateChanged, Firebase oturumunu dinler. Sonuç Provider ile
bütün ağaca iner. AdminLayout bu sağlayıcının içindedir. Sayfa
kapısı bu dosyada çizilmez. Kapı, auth-state.js içindeki useAuth
ile bu state'i okuyacak.

GÜVENLİK NOTU
Bu dosya jetonu tarayıcı deposuna kopyalamaz. Firebase kendi
oturum kaydını tutar. Kullanıcı nesnesi konsola yazılmaz. Çıkış
Header içindedir. currentUser null ise personel oturumu yoktur.
ProtectedRoute bu değeri okur.

STATE YÖNETİMİ
currentUser, oturumdaki personeldir. Yoksa null kalır. ready, ilk
dinleme bitmeden ekranın "giriş yok" sanmaması içindir. İkisi
useState'tir. Dinleyici bileşen kalkınca bırakılır.
*/
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase.js'
import { AuthContext } from './auth-state.js'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setCurrentUser(nextUser)
      setReady(true)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, ready }}>{children}</AuthContext.Provider>
  )
}
