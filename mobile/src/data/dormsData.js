/*
MİMARİ AÇIKLAMA
Yurt listesi bir katalogdur. Ekran yurt uydurmaz. Her kayıt aynı alanları
taşır: kimlik, ad, tür, cinsiyet, kurum, mesafe, adres, koordinat, telefon,
başvuru adresi, imkânlar ve üç fotoğraf. Tür kodu
süzgecin anahtarıdır. Etiket, rozetin üstündeki kısa addır. Böylece
"KYK Erkek" süzgeci metin aramaz, type alanına bakar.

SAHA GERÇEKLİĞİ
İlçedeki erkek KYK yurdu, Gençlik ve Spor Bakanlığı tesis listesinde
Hafız Mustafa Sümer Öğrenci Yurdu olarak erkek tiptedir. Adres Nasuhpaşa
Mahallesi, Ayhan Sümer Caddesi No: 12, telefon 0312 785 12 50.
Yüksekokulun 22 Ağustos 2025 sayfası kapasiteyi 82 öğrenci yazar ve
kızlar için ayrı bir KYK yurdu saymaz. Aynı sayfa, 32 kişilik kız
öğrenci lojmanını yüksekokulun kendi barınması olarak duyurur. Bu yüzden
ikinci kayıt özel pansiyon değildir. Özel erkek pansiyonunun işletme adı
ve telefonu yayımlanmış bir kaynaktan doğrulanmadı. O kart taslaktır.
Koordinatlar kapı ölçümü değildir. Harita iğnesi değişecekse yalnızca
latitude ve longitude yazılır.
Kaynak: https://kygm.gsb.gov.tr/Ajax/gettesis.aspx?il=ankara
Kaynak: https://nallihanmyo.ankara.edu.tr/2025/08/22/kiz-ogrenci-lojmanimiz/
Kaynak: https://www.turkiye.gov.tr/gsb-yurt-basvurusu

DONANIM ENTEGRASYONU
Bu dosya telefonu açmaz ve haritayı çağırmaz. phoneTel, tel: bağlantısının
ham numarasıdır. Başında artı ve ülke kodu vardır. latitude ile longitude,
harita düğmesinin sorgu çiftidir. applyUrl, e-Devlet başvuru sayfasıdır.
Başvuru bu uygulamada toplanmaz.
*/

export const DORMS = [
  {
    id: 'hafiz-mustafa-sumer',
    name: 'Hafız Mustafa Sümer Erkek KYK Yurdu',
    type: 'kyk_male',
    typeLabel: 'KYK',
    gender: 'Erkek',
    institution: 'Gençlik ve Spor Bakanlığı (KYK)',
    distance: 'İlçe merkezi, Ayhan Sümer Caddesi. Okula yürüyüş bu sürümde ölçülmedi.',
    address: 'Nasuhpaşa Mahallesi, Ayhan Sümer Caddesi No: 12, Nallıhan / Ankara',
    /*
    KOORDİNAT
    40.1852 ve 31.3524 rehber iğnesidir. Kapı ölçümü değildir.
    Kesin koordinat gelince yalnızca bu iki sayıyı değiştirin.
    */
    latitude: 40.1852,
    longitude: 31.3524,
    phoneDisplay: '0312 785 12 50',
    phoneTel: '+903127851250',
    applyUrl: 'https://www.turkiye.gov.tr/gsb-yurt-basvurusu',
    applyLabel: 'e-Devlet yurt başvurusu',
    capacityNote: 'Yüksekokul sayfası bu yurdun kapasitesini 82 öğrenci olarak yazar.',
    draft: false,
    amenities: [
      'Sabah ve akşam yemek',
      'Çamaşırhane',
      'Çalışma salonu',
      '7/24 güvenlik',
    ],
    amenityNote: 'Öğün ve salon satırları KYK yurt düzeninin rehber özetidir. Dönem duyurusu esastır.',
    /*
    FOTOĞRAF
    Üç adres bu binanın cephesi değildir. Unsplash yer tutucusudur.
    Gerçek fotoğraf gelince url alanını değiştirin. Sıra bozulmasın diye id kalsın.
    */
    photos: [
      {
        id: 'sumer-1',
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&h=750&q=80',
      },
      {
        id: 'sumer-2',
        url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&h=750&q=80',
      },
      {
        id: 'sumer-3',
        url: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&h=750&q=80',
      },
    ],
  },
  {
    id: 'myo-kiz-lojmani',
    name: 'Nallıhan MYO Kız Öğrenci Lojmanı',
    type: 'school_female',
    typeLabel: 'Okul lojmanı',
    gender: 'Kız',
    institution: 'Ankara Üniversitesi Nallıhan MYO',
    distance: 'Yüksekokul yerleşkesi. Ayrı bir yürüme süresi yayımlanmadı.',
    address: 'Ankara–Nallıhan Yolu, Nasuhpaşa No: 13/C, Nallıhan / Ankara',
    /*
    KOORDİNAT
    40.1838 ve 31.3582 yerleşke tarafı için rehber iğnesidir.
    Lojmanın ayrı kapı koordinatı yayımlanmadı. Kesin ölçüm gelince
    yalnızca bu iki sayıyı değiştirin.
    */
    latitude: 40.1838,
    longitude: 31.3582,
    phoneDisplay: '0312 785 60 60',
    phoneTel: '+903127856060',
    applyUrl: 'https://nallihanmyo.ankara.edu.tr/2026/09/09/kiz-ogrenci-lojmanina-yerlesim-duyurusu/',
    applyLabel: 'Yerleşim duyurusu',
    capacityNote: 'Kapasite 32 öğrencidir. 2026-2027 yerleşim duyurusu 16 Eylül 2026 tarihini yazar. Başvuru öğrenci işlerine yapılır.',
    draft: false,
    amenities: [
      '32 öğrenci kapasitesi',
      'Başvuru öğrenci işleri üzerinden',
      'İletişim yüksekokul santrali',
    ],
    amenityNote: 'Oda tipi, mutfak ve ücret okul sayfasında tek tek yazılmaz. Bu kart o listeyi uydurmaz.',
    /*
    FOTOĞRAF
    Üç adres lojmanın odası değildir. Unsplash yer tutucusudur.
    Gerçek oda fotoğrafı gelince url alanını değiştirin.
    */
    photos: [
      {
        id: 'lojman-1',
        url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&h=750&q=80',
      },
      {
        id: 'lojman-2',
        url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&h=750&q=80',
      },
      {
        id: 'lojman-3',
        url: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&h=750&q=80',
      },
    ],
  },
  {
    id: 'ozel-erkek-apart',
    name: 'Nallıhan Özel Erkek Öğrenci Pansiyonu / Apart',
    type: 'private_male',
    typeLabel: 'Özel',
    gender: 'Erkek',
    institution: 'Özel işletme (adı doğrulanmadı)',
    distance: 'Tahmin: ilçe merkezi, çarşı içi. Okula 10 dk yürüme ölçülmedi.',
    address: 'Kapı adresi doğrulanmadı. Adres gelince bu satırı değiştirin.',
    /*
    KOORDİNAT
    40.1845 ve 31.3540 taslak iğnedir. Kesin kapı koordinatı gelince
    yalnızca latitude ve longitude değerlerini değiştirin.
    Harita düğmesi bu iki sayıyı açar.
    */
    latitude: 40.1845,
    longitude: 31.3540,
    phoneDisplay: null,
    phoneTel: null,
    applyUrl: null,
    applyLabel: null,
    capacityNote: null,
    draft: true,
    amenities: [],
    amenityNote: 'İmkân listesi işletme doğrulayınca amenities dizisine yazılır. Boş dizi, uydurma Wi-Fi satırı basmaz.',
    /*
    FOTOĞRAF
    Üç adres bu apartın fotoğrafı değildir. Unsplash yer tutucusudur.
    Gerçek cephe gelince url alanını değiştirin. id değerini koruyun.
    */
    photos: [
      {
        id: 'apart-1',
        url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&h=750&q=80',
      },
      {
        id: 'apart-2',
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&h=750&q=80',
      },
      {
        id: 'apart-3',
        url: 'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=1200&h=750&q=80',
      },
    ],
  },
];

export const DORM_FILTERS = [
  { id: 'all', label: 'Tümü' },
  { id: 'kyk_male', label: 'KYK Erkek' },
  { id: 'school_female', label: 'Kız Lojmanı' },
  { id: 'private_male', label: 'Özel Erkek' },
];

/*
MİMARİ AÇIKLAMA
Süzgeç, listedeki type alanına bakar. Ekran, "kız" kelimesini kartın
adında aramaz. Yeni bir yurt eklenince aynı tür kodu aynı çipe düşer.
Tümü, dizinin kendisidir. Kopya katalog tutulmaz.

SAHA GERÇEKLİĞİ
Çip adları kayıttaki türe göredir. Kız kaydı okul lojmanıdır. Bu yüzden
çip "Özel Kız" değil, "Kız Lojmanı"dır. Özel kız pansiyonu diye yayımlanmış
bir işletme bu listeye yazılmadı.

DONANIM ENTEGRASYONU
Süzgeç sensör, konum veya rehber okumaz. Seçim bellekteki diziyi keser.
*/
export function filterDorms(type) {
  if (!type || type === 'all') {
    return DORMS;
  }
  return DORMS.filter((dorm) => dorm.type === type);
}
