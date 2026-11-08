/*
MİMARİ GEREKÇE
Kampüs rehberi bir bina, onun katları ve kattaki birimler olarak durur.
Öğrenci "nerede?" diye sorduğunda yanıt bir oda kartıdır; veri ise önce
binayı, sonra katı bilir. Kat adı birimin üstündeki kattan gelir. Böylece
bir oda hem zemin katta hem 1. katta yazılamaz. Düz liste arama için bu
ağaçtan üretilir, ikinci bir katalog elle tutulmaz.

PERFORMANS NOTU
Ağaç küçüktür: tek bina, üç kat, on iki birim. Düzleştirme modül
yüklendiğinde bir kez çalışır. Tuşa basıldıkça ağaç yeniden gezilmez.
Arama, üretilmiş dizinin üstünde yürür.

NASIL ÇALIŞIR?
CAMPUS_BUILDING kaynaktır. listCampusUnits her katın birimlerine o katın
adını basar ve tek dizi döndürür. Arama kutusu bu diziyi okur.
*/

export const CAMPUS_BUILDING = {
  id: 'ana-bina',
  name: 'Nallıhan MYO Ana Bina',
  floors: [
    {
      id: 'zemin',
      name: 'Zemin Kat',
      units: [
        {
          id: 'ogrenci-isleri',
          name: 'Öğrenci İşleri',
          category: 'idari',
          description: 'Kayıt, belge ve öğrenci dosyası işleri giriş katındaki birimdedir.',
          workingHours: 'Hafta içi 08:30–17:00',
          keywords: ['ogrenci isleri', 'kayit', 'belge', 'transkript', 'danisma'],
        },
        {
          id: 'idari-ofisler',
          name: 'İdari Ofisler',
          category: 'idari',
          description: 'Yüksekokul sekreterliği ve idari birimler giriş katında toplanır.',
          workingHours: 'Hafta içi 08:30–17:00',
          keywords: ['sekreterlik', 'mudurluk', 'idare', 'evrak'],
        },
        {
          id: 'kantin',
          name: 'Kantin',
          category: 'sosyal',
          description: 'Gün içi yiyecek ve içecek için kullanılan ortak alandır.',
          workingHours: 'Hafta içi 08:30–17:30',
          keywords: ['kafe', 'cay', 'bufe', 'yeme icme'],
        },
        {
          id: 'guvenlik',
          name: 'Güvenlik',
          category: 'idari',
          description: 'Giriş kontrolü ve kampüs güvenlik noktası zemin kattadır.',
          workingHours: '7 gün 24 saat',
          keywords: ['bekci', 'giris', 'kontrol', 'acil'],
        },
        {
          id: 'yemekhane',
          name: 'Yemekhane',
          category: 'sosyal',
          description: 'Öğle yemeğinin verildiği salondur. Günlük liste idare yayınından gelir.',
          workingHours: 'Hafta içi 11:30–13:30',
          keywords: ['yemek', 'ogle', 'menu', 'yemekhane'],
        },
      ],
    },
    {
      id: 'kat-1',
      name: '1. Kat',
      units: [
        {
          id: 'd-101',
          name: 'Derslik D-101',
          category: 'derslik',
          description: 'Birinci kattaki derslik. Kapı kodu D-101.',
          workingHours: 'Ders programındaki saatlerde',
          keywords: ['sinif', 'd101', 'derslik', 'amfi'],
        },
        {
          id: 'd-102',
          name: 'Derslik D-102',
          category: 'derslik',
          description: 'Birinci kattaki derslik. Kapı kodu D-102.',
          workingHours: 'Ders programındaki saatlerde',
          keywords: ['sinif', 'd102', 'derslik'],
        },
        {
          id: 'ogretim-gorevlileri',
          name: 'Öğretim Görevlileri Odaları',
          category: 'idari',
          description: 'Öğretim görevlilerinin odaları birinci katta yan yanadır.',
          workingHours: 'Hafta içi 08:30–17:00',
          keywords: ['hoca', 'ogretim', 'ofis', 'danisman'],
        },
        {
          id: 'kutuphane',
          name: 'Kütüphane',
          category: 'sosyal',
          description: 'Kitap ve sessiz çalışma alanı birinci kattadır.',
          workingHours: 'Hafta içi 08:30–17:00',
          keywords: ['kitap', 'calisma', 'okuma', 'kutuphane'],
        },
      ],
    },
    {
      id: 'kat-2',
      name: '2. Kat',
      units: [
        {
          id: 'lab-1',
          name: 'Bilgisayar Laboratuvarı 1',
          category: 'lab',
          description: 'Yazılım ve uygulamalı bilişim derslerinin birinci laboratuvarı.',
          workingHours: 'Ders ve uygulama saatlerinde',
          keywords: ['laboratuvar', 'bilgisayar', 'lab', 'yazilim', 'pc'],
        },
        {
          id: 'lab-2',
          name: 'Bilgisayar Laboratuvarı 2',
          category: 'lab',
          description: 'İkinci bilgisayar laboratuvarı. Uygulama grupları burada ayrılır.',
          workingHours: 'Ders ve uygulama saatlerinde',
          keywords: ['laboratuvar', 'bilgisayar', 'lab', 'uygulama'],
        },
        {
          id: 'konferans',
          name: 'Konferans Salonu',
          category: 'sosyal',
          description: 'Toplantı, seminer ve toplu etkinliklerin yapıldığı salon.',
          workingHours: 'Etkinlik duyurusundaki saatte',
          keywords: ['salon', 'seminer', 'etkinlik', 'toplanti'],
        },
      ],
    },
  ],
};

/*
MİMARİ GEREKÇE
Arama ve rozet, kat adını birimin kendi alanından okur. Kaynak ağaçta kat
adı yalnızca kat düğümündedir. Bu fonksiyon o adı her birime basar.
Böylece ekran kat dizisine inmek zorunda kalmaz.

PERFORMANS NOTU
flatMap bir kez, modül değerlendirilirken çağrılır. Sonuç CAMPUS_UNITS
olarak tutulur. On iki kart için başka bir önbellek gerekmez.

NASIL ÇALIŞIR?
Her katın units dizisi açılır. Birime floor ve floorId eklenir. Ağaçtaki
diğer alanlar (id, name, category, description, workingHours, keywords)
olduğu gibi kalır.
*/

export function listCampusUnits(building) {
  return building.floors.flatMap((floor) =>
    floor.units.map((unit) => ({
      ...unit,
      floor: floor.name,
      floorId: floor.id,
    })),
  );
}

export const CAMPUS_UNITS = listCampusUnits(CAMPUS_BUILDING);

/*
MİMARİ GEREKÇE
Kaydırıcıdaki panolar kampüsün anlatılacak dört yüzüdür: bina, derslik,
laboratuvar, ortak yaşam. Fotoğraf dosyası repoda yoktur. Resmî bir
kampüs karesini izinsiz indirmek yerine pano metni burada durur. Dosya
gelince image alanı require() ile dolar, başlıklar yerinde kalır.

PERFORMANS NOTU
Dört kısa kayıt vardır. Görsel bileşen bunları olduğu gibi okur, süzmez.

NASIL ÇALIŞIR?
CampusSlider bu diziyi yatay sayfalar halinde gösterir. tone, panonun
lacivert ya da altın zeminden hangisini kullanacağını söyler.
*/

export const CAMPUS_SLIDES = [
  {
    id: 'bina',
    title: 'Ana bina',
    caption: 'Öğrenci işleri, idare, kantin, güvenlik ve yemekhane zemin kattadır.',
    tone: 'primary',
    icon: 'business',
  },
  {
    id: 'derslik',
    title: '1. Kat',
    caption: 'D-101, D-102, öğretim görevlileri odaları ve kütüphane.',
    tone: 'accent',
    icon: 'school',
  },
  {
    id: 'lab',
    title: 'Laboratuvarlar',
    caption: 'Bilgisayar laboratuvarları ve konferans salonu 2. kattadır.',
    tone: 'primary',
    icon: 'desktop-outline',
  },
  {
    id: 'ortak',
    title: 'Ortak alanlar',
    caption: 'Kantin, yemekhane ve kütüphane gün içi duraklardır.',
    tone: 'accent',
    icon: 'cafe',
  },
];

/*
MİMARİ GEREKÇE
Yemekhane, takvim ve acil numaralar arama kartı değildir. Ana sayfadaki
kısayolun açtığı metindir. Numaralar ayrı durur ki telefon bağlantısı
paragrafa gömülmesin. 112 ülke acil hattıdır. Santral, yüksekokulun
sitesinde yayımlanan numaradır.

PERFORMANS NOTU
Üç kayıt, uygulama açılırken bellekte hazırdır. Modal açılınca ağdan
menü veya takvim istenmez.

NASIL ÇALIŞIR?
unitId doluysa modal, CAMPUS_UNITS içinden o birimin katını ve saatini
de okur. numbers doluysa her satır bir arama bağlantısı olur.
*/

export const CAMPUS_SHORTCUTS = [
  {
    id: 'yemekhane',
    title: 'Yemekhane Menüsü',
    icon: 'restaurant',
    unitId: 'yemekhane',
    paragraphs: [
      'Günün yemek listesi idare yayınlayınca bu kartta durur. Liste henüz bu sürüme bağlanmadı. Aşağıdaki satır, yemekhanenin kat rehberindeki yeridir.',
    ],
  },
  {
    id: 'takvim',
    title: 'Akademik Takvim',
    icon: 'calendar',
    unitId: null,
    paragraphs: [
      'Dönem başlangıcı, ara sınav ve final tarihleri Ankara Üniversitesi akademik takviminden gelir. Tarih uydurulmaz. İdare bu kartın metnini yönetim panelinden yazacaktır.',
    ],
  },
  {
    id: 'acil',
    title: 'Acil Numaralar',
    icon: 'call',
    unitId: 'guvenlik',
    paragraphs: [
      '112 her zaman aranır. Okul santrali, Nallıhan MYO sitesinde yayımlanan numaradır. Güvenlik noktasının yeri kat rehberindedir.',
    ],
    numbers: [
      { id: 'acil-112', label: 'Acil Çağrı', value: '112', tel: '112' },
      {
        id: 'santral',
        label: 'Okul santrali',
        value: '0312 785 60 60',
        tel: '+903127856060',
      },
    ],
  },
];
