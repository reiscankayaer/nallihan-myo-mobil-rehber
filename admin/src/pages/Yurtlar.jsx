/*
MİMARİ AÇIKLAMA
Yurtlar sayfası, /yurtlar adresindedir. KYK yurdu, kız lojmanı ve
özel pansiyon kayıtlarının yönetim karşılığı olacaktır. Bu dosya
şimdilik yalnızca yer tutar.

GÜVENLİK NOTU
Kapasite, ücret ve telefon bu sayfada yoktur. Uydurma kurumsal sayı
yazılmaz. Kayıt formu yoktur.

STATE YÖNETİMİ
Seçili yurt veya form state'i yoktur. Sayfa statiktir.
*/
export default function Yurtlar() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">Yurtlar ve Pansiyonlar</h1>
        <p className="mt-3 text-base text-slate-700">Çok Yakında Firebase'e Bağlanacak</p>
      </div>
    </section>
  )
}
