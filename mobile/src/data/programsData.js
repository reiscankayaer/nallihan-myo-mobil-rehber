/*
MİMARİ GEREKÇE
Bölüm kartı aday öğrencinin okuduğu kayıttır. Süre, kontenjan, laboratuvar
cümlesi, mezuniyet alanı ve YÖK Atlas adresi aynı nesnede durur. Kart
yalnızca adı gösterir. Ayrıntı modalı aynı nesnenin kalan alanlarını açar.
Böylece listede bir metin, modalda başka bir metin yazılmaz.

PERFORMANS NOTU
Dört program vardır. Dizi modül yüklenince sabittir. Yatay şerit bunu
olduğu gibi basar, süzmez ve sayfalara bölmez.

NASIL ÇALIŞIR?
Her kayıt 2026 YÖK Atlas genel kontenjanını ve ÖSYM program kodunu taşır.
Kontenjan yılı değişir. sourceYear bunu söyler. Tercih anında esas olan
ÖSYM kılavuzudur. yokAtlasUrl, o programın Atlas sayfasıdır.
Elektrik ve yenilenebilir enerjide yerleşen sayısı kontenjandan bir fazla
görünebilir. Atlas tablosu böyledir. Alanlar birbirine karıştırılmaz.
*/

export const PROGRAMS = [
  {
    id: 'bilgisayar-programciligi',
    name: 'Bilgisayar Programcılığı',
    osymCode: '101150783',
    duration: '2 yıl',
    quota: 65,
    placed: 65,
    sourceYear: 2026,
    labs: 'Uygulama, 2. kattaki bilgisayar laboratuvarlarında ve 3+1 modelinin işletmede mesleki eğitim döneminde yürür.',
    employment:
      'Mezunlar kamu ve özel sektörün bilgi işlem birimlerinde programlama ve teknik destek işlerinde çalışır. Kendi işini kurmak da bu alanın içindedir. Dikey geçişin koşulları güncel kılavuzdadır.',
    yokAtlasUrl: 'https://yokatlas.yok.gov.tr/detay/101150783',
  },
  {
    id: 'elektronik-teknolojisi',
    name: 'Elektronik Teknolojisi',
    osymCode: '101150792',
    duration: '2 yıl',
    quota: 65,
    placed: 65,
    sourceYear: 2026,
    labs: 'Uygulamalı dersler ve 3+1 modelindeki işletmede mesleki eğitim, programın laboratuvar yanıdır.',
    employment:
      'Mezunlar elektronik üretim, bakım ve teknik servis işlerinde tekniker olarak görev alır. Güncel istihdam koşulları ilan ve kılavuzla izlenir.',
    yokAtlasUrl: 'https://yokatlas.yok.gov.tr/detay/101150792',
  },
  {
    id: 'elektrik-enerjisi',
    name: 'Elektrik Enerjisi Üretim, İletim ve Dağıtımı',
    osymCode: '101190780',
    duration: '2 yıl',
    quota: 35,
    placed: 36,
    sourceYear: 2026,
    labs: 'Saha uygulaması, 3+1 modelinin son dönemindeki işletmede mesleki eğitimle tamamlanır.',
    employment:
      'Mezunlar elektrik üretimi, iletimi ve dağıtımı yapan tesislerde teknikerlik yapar.',
    yokAtlasUrl: 'https://yokatlas.yok.gov.tr/detay/101190780',
  },
  {
    id: 'yenilenebilir-enerji',
    name: 'Yenilenebilir Enerji Teknikerliği',
    osymCode: '101190787',
    duration: '2 yıl',
    quota: 35,
    placed: 36,
    sourceYear: 2026,
    labs: 'İlk üç dönem ders ve uygulama, son dönem 14 haftalık işletmede mesleki eğitimdir. Bu yapı yüksekokulun program sayfasında da yazar.',
    employment:
      'Mezunlar güneş, rüzgâr ve diğer yenilenebilir enerji sistemleri ile enerji verimliliği işlerinde çalışır.',
    yokAtlasUrl: 'https://yokatlas.yok.gov.tr/detay/101190787',
  },
];

/*
MİMARİ GEREKÇE
Kart, dizideki kaydın kendisini modalın state'ine koyar. Kimlikle yeniden
aramak, aynı kaydı ikinci kez bulmaktır. Bu fonksiyon yine de dışarıdan
yalnızca kod bilen bir çağrı için durur.

PERFORMANS NOTU
Dört elemanlı find, bir dokunuşta biter. Sonuç saklanmaz.

NASIL ÇALIŞIR?
id eşleşen ilk kayıt döner. Eşleşme yoksa null döner. Modal null görünce
kapanır.
*/

export function findProgram(id) {
  return PROGRAMS.find((program) => program.id === id) ?? null;
}
