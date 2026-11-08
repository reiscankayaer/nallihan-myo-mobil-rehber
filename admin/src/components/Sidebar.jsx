/*
MİMARİ AÇIKLAMA
Sidebar, panelin altı işine giden menüdür. Her satır bir NavLink'tir.
Adres eşleşince satır lacivert zemin ve beyaz yazı alır. Diğer satırlar
açık zemin üstünde durur. Üzerine gelince açık gri olur. Menü ayrı
bir sayfa değildir. Layout'un sol kolonudur.

GÜVENLİK NOTU
Menü satırı yetki vermez. Görünen satır, o işi yapma hakkı değildir.
Bu sürümde satırların ardı boş sayfadır. Yazma formu yoktur. Personel
rolü Firebase bağlanınca satırları kesecek.

STATE YÖNETİMİ
Seçili satır useState ile tutulmaz. NavLink, adres çubuğundan okur.
Dashboard satırında end vardır. Böylece yalnızca kök adres onu seçer.
Dar ekranda menünün kayması open değerinden gelir. Bu değer
AdminLayout'ta durur. Satıra basılınca onNavigate çağrılır ve
menü kapanır.
*/
import {
  Building,
  Bus,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Settings,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'

const ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/duyurular', label: 'Duyurular', icon: Megaphone },
  { to: '/yurtlar', label: 'Yurtlar ve Pansiyonlar', icon: Building },
  { to: '/ulasim', label: 'Ulaşım ve Fiyatlar', icon: Bus },
  { to: '/bolumler', label: 'Bölümler', icon: GraduationCap },
  { to: '/ayarlar', label: 'Ayarlar', icon: Settings },
]

export default function Sidebar({ open, hiddenFromKeyboard, onNavigate }) {
  return (
    <aside
      id="panel-menu"
      inert={hiddenFromKeyboard ? true : undefined}
      className={[
        'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform',
        open ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0',
      ].join(' ')}
    >
      <div className="border-b-2 border-secondary px-4 py-5">
        <p className="text-xs font-semibold tracking-wide text-secondary">Ankara Üniversitesi</p>
        <p className="mt-1 text-base font-semibold text-primary">Nallıhan MYO</p>
        <p className="text-sm text-slate-600">Yönetim Paneli</p>
      </div>
      <nav aria-label="Panel menüsü" className="flex flex-1 flex-col gap-1 p-3">
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onNavigate}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium',
                  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-slate-700 hover:bg-slate-100',
                ].join(' ')
              }
            >
              <Icon aria-hidden="true" size={18} />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
