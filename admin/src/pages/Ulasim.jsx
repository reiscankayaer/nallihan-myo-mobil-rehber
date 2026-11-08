/*
MİMARİ AÇIKLAMA
Ulaşım sayfası, /ulasim adresindedir. EGO ve ÖTA satırlarının saat
ve ücret alanları buradan doldurulacaktır. Mobil kartlardaki boş
saat ve ücret bu yüzden panele bırakılmıştı.

GÜVENLİK NOTU
Saat ve ücret bu sayfada yoktur. Yayımlanmamış tarife uydurulmaz.
Kayıt formu yoktur.

STATE YÖNETİMİ
Tarife formu ve seçili hat state'i yoktur. Sayfa statiktir.
*/
export default function Ulasim() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">Ulaşım ve Fiyatlar</h1>
        <p className="mt-3 text-base text-slate-700">Çok Yakında Firebase'e Bağlanacak</p>
      </div>
    </section>
  )
}
