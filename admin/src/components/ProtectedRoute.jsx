/*
MİMARİ AÇIKLAMA
ProtectedRoute, panel sayfalarının kalkanıdır. AdminLayout ve içindeki
rotalar bu bileşenin çocuğudur. Giriş ekranı çocuk değildir. Oturum
yoksa adres /login olur. Oturum varsa çocuk çizilir.

GÜVENLİK NOTU
Kalkan yalnızca currentUser varlığına bakar. Rol veya Firestore kuralı
burada yoktur. ready bitmeden yönlendirme yapılmaz. İlk anda kullanıcı
null göründüğü için sayfa yenilenince oturum düşmüş sanılmaz. Yönlendirme
replace ile yapılır. Geri tuşu korumalı adrese dönmez.

STATE YÖNETİMİ
Bu dosya state tutmaz. currentUser ve ready, useAuth ile okunur.
Yazma AuthContext'tedir. children, React Router'ın bu kapıya verdiği
AdminLayout'tur.
*/
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/auth-state.js'

export default function ProtectedRoute({ children }) {
  const { currentUser, ready } = useAuth()

  if (!ready) {
    return (
      <p className="grid min-h-screen place-items-center bg-slate-100 text-sm text-slate-600" role="status">
        Oturum kontrol ediliyor
      </p>
    )
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />
  }

  return children
}
