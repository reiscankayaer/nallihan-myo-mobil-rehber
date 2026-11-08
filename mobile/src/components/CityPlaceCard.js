/*
MİMARİ AÇIKLAMA
Şehir kartı, ulaşım, tesis ve gezi için tek kabuktur. Üstte ad ve kısa
cümle durur. "Ayrıntı" açılınca durak, imkân, saat notu ve kaynak aynı
kartın içinde belirir. Yeni sayfa açılmaz. Yol tarifi ve arama, kartın
kendi düğmeleridir. Numara veya harita hedefi yoksa düğme basılamaz.

ADMİN PANELİ ENTEGRASYONU
Kart, alan adı okur. Saat doluysa onu, boşsa hoursNote cümlesini basar.
Panel fare ve phoneTel yazınca aynı düğmeler canlanır. Bileşen, boş
alan için ücret uydurmaz. isDynamic rozeti, bu kaydın panelden
güncelleneceğini söyler. Taslak rozeti, işletmesi doğrulanmamış kayıttadır.

SAHA GERÇEKLİĞİ
Harita hedefi varsa düğme ya kapı koordinatını ya da yerin adını açar.
Koordinat yokken ada göre arama yapılır. Bu, ölçülmüş bir iğne değildir.
Telefon yokken "Ara" kapalıdır. Uydurma hat yazılmaz.
*/

import { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';

/*
MİMARİ AÇIKLAMA
Harita adresi tek yerde kurulur. Koordinat doluysa sorgu enlem ve
boylamdır. Koordinat boşsa ve mapQuery varsa sorgu yerin adıdır.
İkisi de yoksa adres üretilmez. Düğme bu yokluğa göre kapanır.

ADMİN PANELİ ENTEGRASYONU
Panel latitude ve longitude yazınca ad araması devreden çıkar. Kapı
ölçümü, ada göre aramadan önceliklidir. Kart bu sırayı kendisi bozmaz.

SAHA GERÇEKLİĞİ
Ad araması, haritanın kendi sonuç listesini açar. Rehber o listenin
ilk satırını doğru kapı diye işaretlemez.
*/
function mapUrl(place) {
  if (typeof place.latitude === 'number' && typeof place.longitude === 'number') {
    return `https://maps.google.com/?q=${place.latitude},${place.longitude}`;
  }
  if (place.mapQuery) {
    return `https://maps.google.com/?q=${encodeURIComponent(place.mapQuery)}`;
  }
  return null;
}

/*
MİMARİ AÇIKLAMA
Yol tarifi, kurulan adresi işletim sistemine verir. Kart, hangi
uygulamanın açılacağını seçmez.

ADMİN PANELİ ENTEGRASYONU
Adres mapUrl çıktısıdır. Panel koordinatı değiştirince bir sonraki
basış yeni adresi açar. Eski adres bellekte tutulmaz.

SAHA GERÇEKLİĞİ
Bu çağrı ölçüm yapmaz. Elindeki metni harita uygulamasına taşır.
*/
function openMap(url) {
  Linking.openURL(url);
}

/*
MİMARİ AÇIKLAMA
Arama, görünen yazıdan değil phoneTel alanından kurulur. Görünen
yazı boşluklu olabilir. Çevirici artı ve ülke kodu ister.

ADMİN PANELİ ENTEGRASYONU
Panel numarayı phoneTel alanına yazmadan bu fonksiyon çağrılmaz.
Düğme kapalı kalır. Ekran, boş numarayla tel: açmaz.

SAHA GERÇEKLİĞİ
Arama kendiliğinden başlamaz. Çevirici açılır. Kullanıcı onaylar.
*/
function openPhone(phoneTel) {
  Linking.openURL(`tel:${phoneTel}`);
}

/*
MİMARİ AÇIKLAMA
Kaynak satırı, EGO veya belediye sayfasını açar. Rehber o sayfanın
yerine geçmez. Öğrenci asıl tabloyu kurumun sitesinde okur.

ADMİN PANELİ ENTEGRASYONU
sourceUrl panelin yazdığı belgedir. Bağlantı yoksa satır çizilmez.
Kart başka bir site seçmez.

SAHA GERÇEKLİĞİ
Bağlantı tarayıcıyı açar. Saat hâlâ kurumun sayfasındadır. Bu uygulama
ücret tahsil etmez.
*/
function openSource(url) {
  Linking.openURL(url);
}

/*
MİMARİ AÇIKLAMA
Ayrıntı gövdesi yalnızca dolu alanları basar. Boş dizi başlık açmaz.
Saat yoksa not cümlesi, not da yoksa satır hiç yok. Böylece her kategori
aynı gövdeyi kullanır ve boş kutu görünmez.

ADMİN PANELİ ENTEGRASYONU
Gövde, panelin doldurduğu dizileri maddele çevirir. Yeni bir imkân,
amenities dizisine bir satır ekler. Yeni bir başlık bileşeni gerekmez.

SAHA GERÇEKLİĞİ
Boş ücret alanı "bilinmiyor" diye uydurulmuş bir rakama dönüşmez.
Not, rakamın neden yazılmadığını söyler.
*/
function DetailBody({ place, colors, scaleFont }) {
  return (
    <View style={styles.detail}>
      <Text style={[styles.detailText, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
        {place.detail}
      </Text>
      {place.destinations ? (
        <View style={styles.block}>
          <Text style={[styles.blockTitle, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
            Güzergâhlar
          </Text>
          {place.destinations.map((item) => (
            <Text key={item} style={[styles.detailText, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
              {`· ${item}`}
            </Text>
          ))}
        </View>
      ) : null}
      {place.stops ? (
        <View style={styles.block}>
          <Text style={[styles.blockTitle, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
            Duraklar
          </Text>
          {place.stops.map((item) => (
            <Text key={item} style={[styles.detailText, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
              {`· ${item}`}
            </Text>
          ))}
          {place.stopsNote ? (
            <Text style={[styles.detailText, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
              {place.stopsNote}
            </Text>
          ) : null}
        </View>
      ) : null}
      {place.amenities ? (
        <View style={styles.block}>
          <Text style={[styles.blockTitle, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
            İmkânlar
          </Text>
          {place.amenities.map((item) => (
            <Text key={item} style={[styles.detailText, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
              {`· ${item}`}
            </Text>
          ))}
          {place.amenityNote ? (
            <Text style={[styles.detailText, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
              {place.amenityNote}
            </Text>
          ) : null}
        </View>
      ) : null}
      {place.hours ? (
        <Text style={[styles.detailText, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
          {place.hours}
        </Text>
      ) : null}
      {place.hoursNote ? (
        <Text style={[styles.detailText, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
          {place.hoursNote}
        </Text>
      ) : null}
      {place.fare ? (
        <Text style={[styles.detailText, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
          {place.fare}
        </Text>
      ) : null}
      {place.fareNote ? (
        <Text style={[styles.detailText, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
          {place.fareNote}
        </Text>
      ) : null}
      {place.sourceUrl ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={place.sourceLabel}
          onPress={() => openSource(place.sourceUrl)}
          style={[styles.source, { borderColor: colors.border }]}
        >
          <Ionicons name="open-outline" size={18} color={colors.accent} />
          <Text style={[styles.sourceLabel, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
            {place.sourceLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function CityPlaceCard({ place }) {
  const { colors, scaleFont } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const directions = mapUrl(place);
  const canCall = Boolean(place.phoneTel);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: open ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start(({ finished }) => {
      if (finished && !open) {
        setMounted(false);
      }
    });
    return () => animation.stop();
  }, [open, progress]);

  const turn = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const shift = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-8, 0],
  });

  /*
  MİMARİ AÇIKLAMA
  Açma, gövdeyi önce ağaca koyar, sonra saydamlıktan görünür kılar.
  Kapama, animasyon bitince gövdeyi söker. Kapalı kartta ayrıntı
  bağlantısı ekran okuyucuda durmaz.

  ADMİN PANELİ ENTEGRASYONU
  Açılan metin o kaydın kendi alanıdır. Panel başka belgenin saatini
  bu kartın içine karıştırmaz.

  SAHA GERÇEKLİĞİ
  Animasyon 240 milisaniyedir ve konum servisi açmaz. Web'de yerli
  animasyon modülü olmadığı için saydamlık JavaScript ile gider.
  */
  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    setMounted(true);
    setOpen(true);
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text
        accessibilityRole="header"
        style={[styles.name, { color: colors.textPrimary, fontSize: scaleFont(18) }]}
      >
        {place.name}
      </Text>
      <View style={styles.badges}>
        {place.isDynamic ? (
          <Text style={[styles.badge, { backgroundColor: colors.accent, color: colors.primary, fontSize: scaleFont(12) }]}>
            Panelden güncellenir
          </Text>
        ) : null}
        {place.draft ? (
          <Text style={[styles.badge, styles.draft, { borderColor: colors.border, color: colors.textSecondary, fontSize: scaleFont(12) }]}>
            Taslak
          </Text>
        ) : null}
      </View>
      <Text style={[styles.summary, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
        {place.summary}
      </Text>
      <View style={styles.actions}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Yol tarifi al"
          accessibilityState={{ disabled: !directions }}
          disabled={!directions}
          onPress={() => openMap(directions)}
          style={[
            styles.action,
            { backgroundColor: colors.primary, borderColor: colors.accent, opacity: directions ? 1 : 0.45 },
          ]}
        >
          <Ionicons name="navigate-outline" size={18} color={colors.onPrimary} />
          <Text style={[styles.actionLabel, { color: colors.onPrimary, fontSize: scaleFont(13) }]}>
            Yol Tarifi Al
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={canCall ? 'Ara' : 'Ara. Telefon henüz yazılmadı.'}
          accessibilityState={{ disabled: !canCall }}
          disabled={!canCall}
          onPress={() => openPhone(place.phoneTel)}
          style={[
            styles.action,
            { borderColor: colors.border, backgroundColor: 'transparent', opacity: canCall ? 1 : 0.45 },
          ]}
        >
          <Ionicons name="call-outline" size={18} color={colors.textPrimary} />
          <Text style={[styles.actionLabel, { color: colors.textPrimary, fontSize: scaleFont(13) }]}>
            Ara
          </Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={open ? 'Ayrıntıyı gizle' : 'Ayrıntıyı gör'}
        onPress={toggle}
        style={styles.toggle}
      >
        <Text style={[styles.toggleLabel, { color: colors.accent, fontSize: scaleFont(14) }]}>
          {open ? 'Ayrıntıyı gizle' : 'Ayrıntıyı gör'}
        </Text>
        <Animated.View style={{ transform: [{ rotate: turn }] }}>
          <Ionicons name="chevron-down" size={18} color={colors.accent} />
        </Animated.View>
      </Pressable>
      <Animated.View style={{ opacity: progress, transform: [{ translateY: shift }] }}>
        {mounted ? <DetailBody place={place} colors={colors} scaleFont={scaleFont} /> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  name: {
    fontWeight: '700',
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: '700',
  },
  draft: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  summary: {
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  action: {
    flex: 1,
    minHeight: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionLabel: {
    fontWeight: '700',
    textAlign: 'center',
  },
  toggle: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontWeight: '700',
  },
  detail: {
    gap: 8,
  },
  block: {
    gap: 4,
  },
  blockTitle: {
    fontWeight: '700',
  },
  detailText: {
    lineHeight: 20,
  },
  source: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sourceLabel: {
    fontWeight: '700',
  },
});
