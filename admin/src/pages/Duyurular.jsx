/*
MİMARİ AÇIKLAMA
Duyurular sayfası, /duyurular adresindedir. Mobil rehberdeki duyuru
listesinin yönetim karşılığı olacaktır. Bu dosya şimdilik yalnızca
yer tutar.

GÜVENLİK NOTU
Duyuru ekleme formu yoktur. Sayfa Firestore'a yazmaz. Yayımlanmamış
metin burada durmaz.

STATE YÖNETİMİ
Liste, filtre ve taslak state'i bu sürümde yoktur. Sayfa statiktir.
*/
export default function Duyurular() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">Duyurular</h1>
        <p className="mt-3 text-base text-slate-700">Çok Yakında Firebase'e Bağlanacak</p>
      </div>
    </section>
  )
}
