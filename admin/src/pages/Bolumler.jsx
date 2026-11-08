/*
MİMARİ AÇIKLAMA
Bölümler sayfası, /bolumler adresindedir. Menüdeki satırın karşılığıdır.
Kontenjan ve program metni bu sürümde buraya bağlanmaz.

GÜVENLİK NOTU
Kontenjan, puan ve ücret yazılmaz. Sayfa Firestore'a gitmez.

STATE YÖNETİMİ
Seçili bölüm state'i yoktur. Sayfa statiktir.
*/
export default function Bolumler() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">Bölümler</h1>
        <p className="mt-3 text-base text-slate-700">Çok Yakında Firebase'e Bağlanacak</p>
      </div>
    </section>
  )
}
