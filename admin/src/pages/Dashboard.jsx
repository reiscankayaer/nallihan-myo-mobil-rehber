/*
MİMARİ AÇIKLAMA
Dashboard, panelin kök adresidir. Menüdeki ilk satır buraya gelir.
Bu sürümde özet kartı yoktur. Ortadaki cümle, sayfanın henüz
Firestore okumadığını söyler.

GÜVENLİK NOTU
Sayfa sayı, ad veya belge çekmez. Görünen metin sabittir. Yazma
düğmesi yoktur.

STATE YÖNETİMİ
Sayfanın kendi state'i yoktur. Hangi ekranın açık olduğu adresin
kök olmasından bellidir.
*/
export default function Dashboard() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">Dashboard</h1>
        <p className="mt-3 text-base text-slate-700">Çok Yakında Firebase'e Bağlanacak</p>
      </div>
    </section>
  )
}
