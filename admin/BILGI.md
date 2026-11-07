# /admin — Web yönetim paneli

Bu klasör, okul personelinin rehber içeriğini kod yazmadan güncellemesi için hazırlanan **React + Vite** panelinin kaynağıdır.

Faz 0'da klasör bilinçli olarak boştur. Panel iskeleti bir sonraki adımda bu dizine kurulacaktır. `BILGI.md`, Git'in boş klasörü takip edebilmesi için durur. Vite kurulum aracı dolu klasöre yazmayı reddederse dosya kurulum anında kenara alınıp sonra yerine konur.

## Bu klasörde ne durur

- Firebase Authentication ile açılan personel oturumu
- Firestore koleksiyonlarıyla birebir eşleşen içerik ekranları: kurum ve programlar, mekânlar, yurtlar, şehir yerleri, ulaşım, acil numaralar, duyurular
- Yayından önce önizleme ve zorunlu alan kontrolü
- Üretim derlemesi Firebase Hosting'e (veya okulun seçeceği statik barındırmaya) gidecek şekilde sade bir arayüz

## Bu klasörde ne durmaz

- Öğrencinin kullandığı mobil ekranlar (onlar `/mobile` altındadır)
- Herkese açık yazma imkânı
- Servis hesabı özel anahtarı, `.env` içindeki gerçek değerler ve `dist/` derleme çıktısı

Panel çevrimiçi çalışır. İçerik ofiste, ağ varken üretilir. Çevrimdışı öncelik öğrenci uygulamasına aittir. Bir personel hesabı kapatıldığında o kişi içerik yazamaz; yayımlanmış veri öğrencinin cihazında kalmaya devam eder.

Faz 2'deki Anılar moderasyon kuyruğu da bu panele eklenecektir. v1 panelinde anı, fotoğraf veya kullanıcı şikâyeti ekranı yoktur. Kapı şartları kök `README.md` içindedir.
