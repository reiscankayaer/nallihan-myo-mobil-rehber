/*
MİMARİ AÇIKLAMA
main.jsx uygulamanın girişidir. React ağacını #root içine bağlar.
BrowserRouter adres çubuğunu tutar. AuthProvider onun içinde App'i
ve AdminLayout'u sarar. Oturum böylece bütün sayfalara iner.

GÜVENLİK NOTU
AuthProvider burada AdminLayout'u da saran ağacın üstündedir.
Oturum dinleyicisi AuthContext içindedir. Bu dosya jeton tutmaz.
/login rotası App içindedir ve kalkanın dışındadır. Kapı
ProtectedRoute'tur.

STATE YÖNETİMİ
Giriş dosyası kendi state'ini tutmaz. Oturum currentUser ve ready
olarak AuthProvider'dan iner. StrictMode geliştirmede çift çağrı yapar.
Dinleyici aboneliği kalkınca bırakılır. Menünün açık hali
AdminLayout içindedir.
*/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
