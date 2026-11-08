/*
MİMARİ AÇIKLAMA
App, panelin sayfa haritasıdır. /login AdminLayout'un dışındadır.
Giriş ekranında sol menü yoktur. Diğer adresler ProtectedRoute
içindeki AdminLayout'tadır. Layout üst çubuğu ve Outlet'i bir kez
çizer. Her menü kendi dosyasına gider.

GÜVENLİK NOTU
AdminLayout, ProtectedRoute ile sarılıdır. currentUser yoksa bu
adresler açılmaz. /login bu kalkanın dışındadır. Oturum AuthProvider
içinden okunur. Sayfalar hâlâ Firestore'a yazmaz.

STATE YÖNETİMİ
App seçili menüyü state ile tutmaz. Seçili satır, adresin kendisidir.
Menünün telefon görünümünde açık olup olmadığı AdminLayout'tadır.
Sayfalar arası veri taşınmaz.
*/
import { Route, Routes } from 'react-router-dom'
import AdminLayout from './components/AdminLayout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Ayarlar from './pages/Ayarlar.jsx'
import Bolumler from './pages/Bolumler.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Duyurular from './pages/Duyurular.jsx'
import Login from './pages/Login.jsx'
import Ulasim from './pages/Ulasim.jsx'
import Yurtlar from './pages/Yurtlar.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="duyurular" element={<Duyurular />} />
        <Route path="yurtlar" element={<Yurtlar />} />
        <Route path="ulasim" element={<Ulasim />} />
        <Route path="bolumler" element={<Bolumler />} />
        <Route path="ayarlar" element={<Ayarlar />} />
      </Route>
    </Routes>
  )
}
