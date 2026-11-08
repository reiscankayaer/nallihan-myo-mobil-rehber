/*
MİMARİ AÇIKLAMA
Ayarlar sayfası, /ayarlar adresindedir. Personel hesabı ve panel
tercihleri daha sonra burada duracaktır. Bu dosya yer tutardır.

GÜVENLİK NOTU
Şifre, anahtar ve oturum ayarı yoktur. Çıkış işi üst çubuktadır
ve o da henüz Firebase çağırmaz.

STATE YÖNETİMİ
Ayar formu yoktur. Sayfa statiktir.
*/
export default function Ayarlar() {
  return (
    <section className="flex min-h-[calc(100vh-7rem)] items-center justify-center rounded-lg border border-slate-200 bg-white p-8">
      <div className="text-center">
        <h1 className="text-2xl font-semibold text-primary">Ayarlar</h1>
        <p className="mt-3 text-base text-slate-700">Çok Yakında Firebase'e Bağlanacak</p>
      </div>
    </section>
  )
}
