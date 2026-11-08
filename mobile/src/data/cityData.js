/*
MİMARİ AÇIKLAMA
Şehir rehberi tek katalogdur. Her kayıt aynı kabuğu taşır: kimlik, kategori,
ad, özet, ayrıntı, saat, ücret, durak, imkân, telefon ve harita alanı.
Kategori, üstteki üç süzgecin anahtarıdır. Kart, "otobüs" kelimesini
aramaz. type yerine category vardır. Böylece ulaşım, sosyal yaşam ve
gezi aynı liste bileşenine düşer. Yeni bir durak eklenince yeni ekran
açılmaz. Kayıt bu diziye yazılır.

ADMİN PANELİ ENTEGRASYONU
Bu dizi, ileride Firestore'daki sehir koleksiyonunun belge şeklidir.
isDynamic true olan kayıtların saat, ücret, durak ve telefon alanlarını
yönetim paneli yazar. Mobil uygulama aynı alan adlarını okur. Bugün
kaynak bu dosyadır. Yarın dinleyici dizinin yerine geçebilir. Kart
bileşeni değişmez. Başvuru ve ödeme bu uygulamada toplanmaz.

SAHA GERÇEKLİĞİ
EGO 677, kurumun 29 Aralık 2022 haberindeki Nallıhan–Ulus halk hattıdır.
ÖTA 577-3, EGO hareket saatleri sayfasında Ankara–Nallıhan adıyla durur.
Sefer saati ve kart ücreti üçüncü parti bloglardan kopyalanmadı. Bu
alanlar null'dur. Nallıhan Aile Yaşam Merkezi, Büyükşehir'in Hacıbey
Mahallesi tesisidir. Masa tenisi, haber metnindeki addır. Kort tenisi
diye yazılmaz. Halı saha ve kafe kartlarında yayımlanmış telefon yoktur.
Arama düğmesi bu yüzden kapalıdır. Slayt adresleri bu yerlerin fotoğrafı
değildir.
Kaynak: https://www.ego.gov.tr/tr/haber/5994/gudul-ve-nallihan-otobus-seferleri-basliyor
Kaynak: https://www.ego.gov.tr/hareketsaatleri?hat_no=577-3
Kaynak: https://www.ankara.bel.tr/haberler/abb-den-nallihan-a-aile-yasam-merkezi-17932
*/

export const CITY_CATEGORIES = [
  { id: 'transport', label: 'Ulaşım & Otogar' },
  { id: 'social', label: 'Sosyal Yaşam & Spor' },
  { id: 'tourism', label: 'Gezilecek Yerler' },
];

export const CITY_SLIDES = [
  {
    id: 'kus-cenneti',
    title: 'Nallıhan Kuş Cenneti',
    caption: 'İlçenin sulak alanı.',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1400&h=800&q=80',
  },
  {
    id: 'koca-han',
    title: 'Koca Han',
    caption: 'Merkezdeki tarihi han.',
    url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1400&h=800&q=80',
  },
  {
    id: 'seyir-terasi',
    title: 'Seyir Terası',
    caption: 'İlçeye bakan seyir noktası.',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1400&h=800&q=80',
  },
];

export const CITY_PLACES = [
  {
    id: 'ego-677',
    category: 'transport',
    name: 'EGO 677',
    summary: 'Nallıhan – Ulus halk otobüsü.',
    detail: 'EGO, hattı Nallıhan, Çayırhan, Beypazarı, Ayaş, İstanbul Yolu ve Ulus güzergâhında tanımlar. Hareket saati EGO Şehir İçi Ulaşım sistemindedir.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: 'Sefer saati bu dosyada sabitlenmedi. Yönetim paneli, EGO sayfasındaki güncel saati yazar.',
    fare: null,
    fareNote: 'Güncel ücret yazılmadı. EGO tarifesi esastır. Panel bu satırı günceller.',
    stops: ['Nallıhan', 'Çayırhan', 'Beypazarı', 'Ayaş', 'İstanbul Yolu', 'Ulus'],
    stopsNote: 'Bu liste haber metnindeki güzergâh özetidir. Durak durak döküm panelden gelir.',
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: null,
    sourceUrl: 'https://www.ego.gov.tr/tr/haber/5994/gudul-ve-nallihan-otobus-seferleri-basliyor',
    sourceLabel: 'EGO haberi',
  },
  {
    id: 'ota-577-3',
    category: 'transport',
    name: 'ÖTA 577-3',
    summary: 'Ankara – Nallıhan özel toplu taşıma hattı.',
    detail: 'Hat, EGO hareket saatleri sayfasında (ÖTA) ANKARA-NALLIHAN adıyla yer alır. Nallıhan Otogarı ve yüksekokul durağı bu sayfada sayılır.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: 'Kalkış saati kopyalanmadı. Panel, EGO hareket saatleri tablosunu yazar.',
    fare: null,
    fareNote: 'Güncel ücret yazılmadı. Tarife değişince panel günceller.',
    stops: [
      'Nallıhan Otogarı',
      'Nasuhpaşa Camii',
      'Ankara Üniversitesi Nallıhan MYO',
      'Çayırhan Otobüs Terminali',
    ],
    stopsNote: 'EGO sayfasındaki Nallıhan tarafı duraklarından kısaltıldı. Tam liste aynı sayfadadır.',
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: null,
    sourceUrl: 'https://www.ego.gov.tr/hareketsaatleri?hat_no=577-3',
    sourceLabel: 'EGO hareket saatleri',
  },
  {
    id: 'sehirlerarasi',
    category: 'transport',
    name: 'Şehirlerarası otobüsler',
    summary: 'Eskişehir, Bolu ve İstanbul güzergâhları.',
    detail: 'Bu üç il, rehberin şehirlerarası başlığıdır. Firma adı ve kalkış saati otogar duyurusundan panele yazılır.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: 'Kalkış saati bu sürümde yok. Panel, otogarın duyurduğu saati yazar.',
    fare: null,
    fareNote: 'Bilet ücreti firmaya göre değişir. Panel yazmadan kart fiyat basmaz.',
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: ['Eskişehir', 'Bolu', 'İstanbul'],
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: 'Nallıhan Otogarı',
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'nallihan-otogar',
    category: 'transport',
    name: 'Nallıhan Otogarı',
    summary: 'İlçe otogarı. Hatlar bu noktadan anılır.',
    detail: 'Yayımlanmış sabit hat bu karta bağlanmadı. Telefon alanı panel içindir. Harita düğmesi ada göre arama açar. Kapı koordinatı sonra latitude ve longitude alanlarına yazılır.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: null,
    fare: null,
    fareNote: null,
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    /*
    KOORDİNAT
    latitude ve longitude boştur. Kesin kapı ölçümü gelince yalnızca
    bu iki sayıyı doldurun. Boşken düğme "Nallıhan Otogarı" diye arar.
    */
    latitude: null,
    longitude: null,
    mapQuery: 'Nallıhan Otogarı',
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'aile-yasam-merkezi',
    category: 'social',
    name: 'Nallıhan Aile Yaşam Merkezi',
    summary: 'Hacıbey Mahallesi. Büyükşehir tesisidir.',
    detail: 'Tesis 29 Ağustos 2025 tarihinde açıldı. Haber, dört kat ve Hacıbey Mahallesi adresini yazar. Ayrı bir telefon bu haberde yoktur.',
    isDynamic: false,
    draft: false,
    hours: null,
    hoursNote: 'Açılış saati haber metninde tek tek yazılmaz. Panel, güncel çalışma saatini ekler.',
    fare: null,
    fareNote: null,
    stops: null,
    stopsNote: null,
    amenities: ['E-spor', 'Fitness', 'Bilardo', 'Masa tenisi', 'Kütüphane', 'BELMEK kursları'],
    amenityNote: 'Liste, 7 Ekim 2025 Büyükşehir haberinden kısaltıldı. Metin masa tenisi der. Kort tenisi yazılmaz.',
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: 'Nallıhan Aile Yaşam Merkezi Hacıbey',
    sourceUrl: 'https://www.ankara.bel.tr/haberler/abb-den-nallihan-a-aile-yasam-merkezi-17932',
    sourceLabel: 'ABB haberi',
  },
  {
    id: 'malida-cafe',
    category: 'social',
    name: 'Malida Cafe',
    summary: 'İlçe içi kafe kaydı.',
    detail: 'Kafe, rehbere adıyla kondu. Yayımlanmış kapı adresi ve telefon bu sürüme bağlanmadı. Panel bu iki alanı doldurunca düğmeler açılır.',
    isDynamic: true,
    draft: true,
    hours: null,
    hoursNote: null,
    fare: null,
    fareNote: null,
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: null,
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'halisaha-11',
    category: 'social',
    name: '11-11 Tam Saha Halısaha',
    summary: 'Tam saha halı saha kaydı.',
    detail: 'İşletme adı ve saha ölçüsü rehber başlığıdır. Yayımlanmış telefon ve kapı koordinatı yoktur. Panel doğrulayınca düğmeler açılır.',
    isDynamic: true,
    draft: true,
    hours: null,
    hoursNote: null,
    fare: null,
    fareNote: 'Saha ücreti yazılmadı. Panel, işletmenin duyurduğu ücreti yazar.',
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: null,
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'halisaha-6',
    category: 'social',
    name: '6-6 Özel Halısaha',
    summary: 'Küçük saha halı saha kaydı.',
    detail: '11-11 kartından ayrı durur. İkisi aynı işletme diye birleştirilmedi. Telefon ve koordinat panelden gelir.',
    isDynamic: true,
    draft: true,
    hours: null,
    hoursNote: null,
    fare: null,
    fareNote: 'Saha ücreti yazılmadı. Panel, işletmenin duyurduğu ücreti yazar.',
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: null,
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'koca-han',
    category: 'tourism',
    name: 'Koca Han',
    summary: 'İlçe merkezindeki tarihi han.',
    detail: 'Ziyaret günü ve bilet bu kartta yoktur. Panel, ilçenin duyurusunu yazarsa saat alanı dolacaktır.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: 'Ziyaret saati yazılmadı.',
    fare: null,
    fareNote: null,
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: 'Nallıhan Koca Han',
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'seyir-terasi',
    category: 'tourism',
    name: 'Seyir Terası',
    summary: 'İlçeye bakan seyir noktası.',
    detail: 'Kapı koordinatı ölçülmedi. Harita düğmesi ada göre arama açar. Kesin iğne latitude ve longitude alanına yazılır.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: null,
    fare: null,
    fareNote: null,
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: 'Nallıhan Seyir Terası',
    sourceUrl: null,
    sourceLabel: null,
  },
  {
    id: 'kus-cenneti',
    category: 'tourism',
    name: 'Nallıhan Kuş Cenneti',
    summary: 'İlçenin sulak alanı.',
    detail: 'Ziyaret ücreti ve kapı saati bu sürüme bağlanmadı. Harita, alanın adıyla arama açar.',
    isDynamic: true,
    draft: false,
    hours: null,
    hoursNote: 'Ziyaret saati yazılmadı.',
    fare: null,
    fareNote: null,
    stops: null,
    stopsNote: null,
    amenities: null,
    amenityNote: null,
    destinations: null,
    phoneDisplay: null,
    phoneTel: null,
    latitude: null,
    longitude: null,
    mapQuery: 'Nallıhan Kuş Cenneti',
    sourceUrl: null,
    sourceLabel: null,
  },
];

/*
MİMARİ AÇIKLAMA
Süzgeç, category alanına bakar. Ekran kartın adında "otogar" aramaz.
Tümü çipi yoktur. Üç kategori birbirinin yerine geçer. Boş sonuç,
yanlış kelime eşleşmesi değil, o kategoride kayıt olmamasıdır.

ADMİN PANELİ ENTEGRASYONU
Panel yeni belge eklerken category değerini bu üç koddan biri yapar.
Kod değişirse çip etiketi değil, bu fonksiyonun karşılaştırması güncellenir.
Etiketler CITY_CATEGORIES içindedir. İkisi ayrı durur.

SAHA GERÇEKLİĞİ
Fonksiyon saatin doğru olup olmadığına bakmaz. Yalnızca kaydın hangi
rafa ait olduğunu keser. Dinamik tarife ile sabit tesis aynı süzgeçten geçer.
*/
export function filterCityPlaces(category) {
  return CITY_PLACES.filter((place) => place.category === category);
}
