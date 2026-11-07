# /mobile — Öğrenci uygulaması

Bu klasör, Ankara Üniversitesi Nallıhan Meslek Yüksekokulu öğrencileri ve aday öğrenciler için hazırlanan **React Native (Expo)** uygulamasının kaynağıdır.

Faz 0'da klasör bilinçli olarak boştur. Uygulama iskeleti bir sonraki adımda bu dizine kurulacaktır. `BILGI.md`, Git'in boş klasörü takip edebilmesi için durur ve klasörün sınırını tarif eder. Expo kurulum aracı dolu klasöre yazmayı reddederse bu dosya kurulum anında geçici olarak kenara alınır, kurulum bitince yerine konur. Ayrıntı kök `README.md` içindeki kurulum bölümündedir.

## Bu klasörde ne durur

- Girişsiz, salt okunur rehber ekranları
- "X Nerede?" kat rehberi, yurtlar, şehir ve ulaşım, ayarlar
- Genel arama ve her zaman erişilebilir acil numaralar
- Çevrimdışı açılış için gömülü tohum veri (en azından sabit acil numaralar ve kurum kimliği)
- Firestore kalıcı önbelleğini okuyan veri katmanı

## Bu klasörde ne durmaz

- İçerik yayınlama formları (onlar `/admin` altındadır)
- Öğrenci hesabı, parola, profil veya anı yükleme
- `node_modules`, `.expo`, üretilmiş `android/` ve `ios/` klasörleri, `.env` ve imza anahtarları (kök `.gitignore` bunları dışarıda tutar)

Uygulama bir kullanıcı kimliği oluşturmaz. Ayarlar (yazı ölçeği, yüksek kontrast, azaltılmış hareket) cihazda kalır. İçerik, yönetim panelinin yazdığı Firestore belgelerinden ve bağlantı yokken bu belgelerin cihazdaki kopyasından gelir.
