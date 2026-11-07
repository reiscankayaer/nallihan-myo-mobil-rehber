# /docs — Şemalar ve sunum notları

Bu klasör, kodun yanında durması gereken ve jürinin kod okumadan da izleyebileceği belgelerin yeridir.

- Firestore veri şeması ve güvenlik kurallarının gerekçesi
- Sunum akışı, ekran senaryoları ve demo kontrol listesi
- Mezuniyet sonrası devir kontrol listesinin işlenmiş hali

Mimari kararın bağlayıcı anlatımı kökteki `README.md` dosyasındadır. Bu klasör o anlatımı tekrar etmez; uygulama yazılırken şema ve sunum malzemesini yanında büyütür.

Aşağıdaki taslak Faz 0 sözleşmesidir. Alan adları kod başlayınca burada dondurulur. Türkçe özel karakter alan adında kullanılmaz; metin değerleri Türkçe kalır.

## v1 koleksiyon taslağı

Öğrenci uygulaması bu koleksiyonları yalnızca okur. Yazma, Firebase Authentication ile personel olduğu kanıtlanmış yönetim paneline aittir. Ayrı bir arama sunucusu yoktur. Her belgede `aramaAnahtarlari` dizisi tutulur; uygulama bu diziyi çevrimdışı tarar. Normalizasyon `tr-TR` yereli ile yapılır, `I/ı` ve `İ/i` ayrımı test edilir.

### `kurum/genel`

Tek belgedir. Okulun kısa tanımı, adres, iletişim, resmî bağlantı ve harita bağlantısı.

| Alan | Tür | Not |
| --- | --- | --- |
| `ad` | string | Görünen kurum adı |
| `ozet` | string | Karşılama metni |
| `adres` | string | Açık adres |
| `telefon` | string | Santral veya danışma |
| `eposta` | string | Kurumsal iletişim |
| `web` | string | Resmî site |
| `haritaUrl` | string | Yol tarifi bağlantısı |
| `guncelleme` | timestamp | Son yayın |

### `programlar/{id}`

Aday öğrenci kartları.

| Alan | Tür | Not |
| --- | --- | --- |
| `ad` | string | Program adı |
| `ozet` | string | Kısa tanım |
| `kayitNotu` | string | Kontenjan veya takvim notu; sayı uydurulmaz, idare yazar |
| `sira` | number | Liste sırası |
| `yayinda` | boolean | Taslakları uygulamadan gizler |
| `aramaAnahtarlari` | string[] | Çevrimdışı arama |

### `mekanlar/{id}`

"X Nerede?" kat rehberi. Konum izni ve bina içi GPS yoktur. Rehber bina, kat ve mekân adı ile çalışır.

| Alan | Tür | Not |
| --- | --- | --- |
| `bina` | string | Bina adı |
| `kat` | string | Örnek: `Zemin`, `1` |
| `ad` | string | Mekânın adı |
| `tur` | string | `sinif`, `laboratuvar`, `idari`, `sosyal`, `diger` |
| `tarif` | string | Kısa yön tarifi |
| `calismaSaati` | string veya null | Serbest metin |
| `sira` | number | Aynı kattaki sıra |
| `yayinda` | boolean | |
| `aramaAnahtarlari` | string[] | |

### `yurtlar/{id}`

| Alan | Tür | Not |
| --- | --- | --- |
| `ad` | string | |
| `tur` | string | `kyk`, `okul`, `ozel`, `diger` |
| `adres` | string | |
| `telefon` | string | |
| `basvuruUrl` | string veya null | Resmî başvuru |
| `yolTarifi` | string | |
| `not` | string | Kural veya dönem notu |
| `sira` | number | |
| `yayinda` | boolean | |
| `aramaAnahtarlari` | string[] | |

### `yerler/{id}`

Şehir rehberi. Canlı belediye servisi çağrılmaz; idarenin doğruladığı kartlar yayınlanır.

| Alan | Tür | Not |
| --- | --- | --- |
| `ad` | string | |
| `kategori` | string | `saglik`, `market`, `kamu`, `ulasim`, `diger` |
| `adres` | string | |
| `telefon` | string veya null | |
| `tarif` | string | |
| `sira` | number | |
| `yayinda` | boolean | |
| `aramaAnahtarlari` | string[] | |

### `ulasim/{id}`

v1 editoryal tarifedir. Saatler metindir. Dış ulaşım API'si, anahtar yönetimi ve çevrimdışı modeli zora soktuğu için kapsam dışıdır.

| Alan | Tür | Not |
| --- | --- | --- |
| `baslik` | string | Hat veya güzergâh |
| `tur` | string | `otobus`, `servis`, `yurume` |
| `ozet` | string | |
| `duraklar` | string[] | Sıralı durak adları |
| `saatNotu` | string | Sefer notu |
| `ucretNotu` | string veya null | |
| `sira` | number | |
| `yayinda` | boolean | |
| `aramaAnahtarlari` | string[] | |

### `acilNumaralar/{id}`

`sabit: true` olan kayıtlar uygulamanın içine gömülü tohum veride de bulunur. Ağ ve Firestore hiç yanıt vermese bile 112 ve idarenin zorunlu saydığı numaralar aranabilir.

| Alan | Tür | Not |
| --- | --- | --- |
| `ad` | string | |
| `numara` | string | `tel:` bağlantısı için |
| `aciklama` | string | |
| `sira` | number | |
| `sabit` | boolean | Tohum veri ile çiftlenir |
| `yayinda` | boolean | |

### `duyurular/{id}`

| Alan | Tür | Not |
| --- | --- | --- |
| `baslik` | string | |
| `govde` | string | |
| `hedef` | string | `herkes`, `ogrenci`, `aday` |
| `yayinTarihi` | timestamp | |
| `bitisTarihi` | timestamp veya null | Boşsa süresiz |
| `yayinda` | boolean | |
| `aramaAnahtarlari` | string[] | |

## v1'de olmayan koleksiyon

`anilar` koleksiyonu Faz 2 kapı şartları tamamlanmadan oluşturulmaz. Fotoğraf deposu, kullanıcı profili ve şikâyet kuyruğu da v1 şemasında yoktur. Gerekçe kök `README.md` içindedir.

## Güvenlik kuralı taslağı

Okunacak ilke şudur. Herkes okuyabilir. Yazma, yalnızca `admin` özel hakkı taşıyan oturumlara açıktır. Doğrulama alan türlerini de reddeder: zorunlu alan boşsa veya `tur` değeri listedeki dışında ise yazma kabul edilmez. Kuralın kendisi kod aşamasında `firestore.rules` olarak yazılır ve bu klasöre gerekçesiyle birlikte not düşülür.

Kurumun logo ve metinleri, idarenin kullanım izniyle panele girer. Uygulama okul sitesini kazımaz.
