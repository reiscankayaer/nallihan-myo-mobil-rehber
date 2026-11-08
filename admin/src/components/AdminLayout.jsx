/*
MİMARİ AÇIKLAMA
AdminLayout panelin kabıdır. Solda sabit Sidebar, sağda üstte Header,
altta Outlet vardır. Sayfa değişince kabin kendisi yeniden kurulmaz.
Yalnızca Outlet'in çocuğu değişir. Dar ekranda menü ekranın dışına
kayar. Geniş ekranda yerinde kalır.

GÜVENLİK NOTU
Kabın kendisi yetki kontrol etmez. Çıkış düğmesi oturum silmez.
Bu sürümde silinecek bir oturum yoktur. Menü açık diye bir sayfa
korumalı sayılmaz.

STATE YÖNETİMİ
Menünün açık hali bu dosyadaki useState'tir. Header düğmesi açar,
perde ve Escape kapatır. Adres değişince menü kapanır. Bu state
kaydedilmez. Geniş ekran ölçüsü matchMedia ile okunur. Kapalı menü
dar ekranda inert olur. Sekme sırasına girmez.
*/
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(
    () => window.matchMedia('(min-width: 768px)').matches,
  )
  useEffect(() => {
    const query = window.matchMedia('(min-width: 768px)')
    const onChange = (event) => setIsDesktop(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const hiddenFromKeyboard = !isDesktop && !menuOpen

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      {menuOpen ? (
        <button
          type="button"
          aria-label="Menüyü kapat"
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}
      <Sidebar
        hiddenFromKeyboard={hiddenFromKeyboard}
        open={menuOpen}
        onNavigate={() => setMenuOpen(false)}
      />
      <div className="md:pl-64">
        <Header menuOpen={menuOpen} onOpenMenu={() => setMenuOpen(true)} />
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
