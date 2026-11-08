/*
MİMARİ AÇIKLAMA
AuthContext nesnesi ve useAuth kancası bu dosyadadır. Sağlayıcı
bileşeni AuthContext.jsx içindedir. İkisi ayrıdır. Bileşen dosyası
yalnızca bileşen dışa aktarır. Kanca, sayfaların oturumu okuduğu
yerdir.

GÜVENLİK NOTU
Kanca, sağlayıcının dışındaysa hata fırlatır. Sessizce boş kullanıcı
döndürmez. Böylece unutulan sarmalayıcı, giriş var sanılmaz.

STATE YÖNETİMİ
Kanca state tutmaz. AuthProvider'ın yazdığı currentUser ve ready
değerini okur. Kendi aboneliği yoktur.
*/
import { createContext, useContext } from 'react'

export const AuthContext = createContext(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('useAuth, AuthProvider içinde kullanılmalıdır.')
  }
  return value
}
