/*
MİMARİ AÇIKLAMA
Header, sağ kolonun üst çubuğudur. Solda dar ekran için menü düğmesi
vardır. Sağda görünen ad ve Çıkış Yap düğmesi durur. Çubuk sayfa
kayınca üstte kalır. Menünün kendisi bu dosyada çizilmez.

GÜVENLİK NOTU
Çıkış Yap, Firebase signOut çağırır. Çağrı bitince adres /login olur
ve history.replace kullanılır. Geri tuşu panele dönmez. Jeton bu
dosyada saklanmaz. Çıkış başarısızsa sahte bir "çıkış yapıldı"
yazılmaz. Kısa bir hata notu kalır.

STATE YÖNETİMİ
Menüyü açma işi onOpenMenu ile AdminLayout'a gider. Çubuk menünün
açık halini kendinde tutmaz. Çıkışın meşgul hali ve hata notu bu
dosyanın useState'idir. Oturumun silinmesi AuthContext dinleyicisine
Firebase üzerinden yansır.
*/
import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { Menu } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase.js'

const STAFF_LABEL = 'Okul Yönetimi'

export default function Header({ menuOpen, onOpenMenu }) {
  const navigate = useNavigate()
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSignOut() {
    setNotice('')
    setBusy(true)
    try {
      await signOut(auth)
      navigate('/login', { replace: true })
    } catch {
      setNotice('Çıkış tamamlanamadı. Yeniden deneyin.')
      setBusy(false)
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-primary hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:hidden"
        aria-label="Menüyü aç"
        aria-controls="panel-menu"
        aria-expanded={menuOpen}
        onClick={onOpenMenu}
      >
        <Menu aria-hidden="true" size={22} />
      </button>
      <p className="hidden text-sm font-medium text-slate-600 md:block">Nallıhan MYO yönetim paneli</p>
      <div className="ml-auto flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-semibold text-primary">{STAFF_LABEL}</p>
          {notice ? (
            <p className="max-w-56 text-xs text-slate-600" role="status">
              {notice}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          className="h-11 rounded-md border border-primary px-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-60"
          disabled={busy}
          onClick={handleSignOut}
        >
          Çıkış Yap
        </button>
      </div>
    </header>
  )
}
