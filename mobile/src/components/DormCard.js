/*
MİMARİ AÇIKLAMA
Yurt kartı, şerit, kimlik, iki donanım düğmesi ve açılır ayrıntıdan oluşur.
Ayrıntı kapalıyken kart kısa kalır. Öğrenci "Tüm özellikleri gör" deyince
imkânlar, adres ve başvuru satırı aynı kartın içinde açılır. Yeni bir
sayfa açılmaz. Hangi kartın açık olduğu o kartın kendi durumudur.

SAHA GERÇEKLİĞİ
Rozetler cinsiyet ve türü söyler. Taslak kart, doğrulanmamış özel kayıtta
ayrıca "Taslak" taşır. Avantaj ve dezavantaj kutusu yoktur. Kart, yargıyı
öğrencinin yerine kurmaz. Yayımlanan adres, imkân ve başvuru satırı yeter.

DONANIM ENTEGRASYONU
Yol tarifi, cihazın harita uygulamasını açar. Arama, çeviriciyi açar.
Numara yoksa arama düğmesi basılamaz. Ayrıntı, saydamlıkla açılır.
Animasyon konum servisini kullanmaz.
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
import DormPhotoSlider from './DormPhotoSlider';

/*
MİMARİ AÇIKLAMA
Harita adresi tek yerde kurulur. Kart, enlem ve boylamı sorgu çiftine
çevirir. Adres metni sorguya karışmaz. Böylece kapı yazısı değişince
iğne kendiliğinden kaymaz. İğne, veri dosyasındaki iki sayıdır.

SAHA GERÇEKLİĞİ
Bu fonksiyon koordinatın kapı ölçümü olup olmadığını bilmez. Veri
dosyası iğneyi taslak diye işaretlese bile düğme o sayıyı açar.
Ayrıntı metni, iğnenin ölçülmediğini söyler.

DONANIM ENTEGRASYONU
Linking.openURL, https://maps.google.com/?q=enlem,boylam adresini
işletim sistemine verir. Sistem, yüklü harita uygulamasını seçer.
Uygulama kendi harita motorunu çalıştırmaz.
*/
function openMap(latitude, longitude) {
  Linking.openURL(`https://maps.google.com/?q=${latitude},${longitude}`);
}

/*
MİMARİ AÇIKLAMA
Arama adresi, görünen yazıdan değil phoneTel alanından kurulur.
Görünen yazı boşluklu olabilir. Çevirici, artı ve ülke kodu ister.

SAHA GERÇEKLİĞİ
Numara veri dosyasında yoksa bu fonksiyon çağrılmaz. Düğme kapalıdır.
Taslak pansiyona uydurma hat yazılmaz.

DONANIM ENTEGRASYONU
Linking.openURL('tel:...') telefon çeviricisini açar. Arama kendiliğinden
başlamaz. Kullanıcı tuş takımında onaylar.
*/
function openPhone(phoneTel) {
  Linking.openURL(`tel:${phoneTel}`);
}

/*
MİMARİ AÇIKLAMA
Başvuru bağlantısı kartın ayrıntısındadır. KYK kaydı e-Devlet sayfasını,
kız lojmanı okul duyurusunu açar. Başvuru formu bu uygulamada yoktur.

SAHA GERÇEKLİĞİ
Adres, kayıttaki applyUrl değeridir. Bileşen başka bir site seçmez.

DONANIM ENTEGRASYONU
Linking.openURL tarayıcıyı veya e-Devlet uygulamasını açar. Bu bir
çevirici çağrısı değildir.
*/
function openPage(url) {
  Linking.openURL(url);
}

/*
MİMARİ AÇIKLAMA
Ayrıntı gövdesi iki yerde çizilir. Biri görünmez ölçüm kopyasıdır.
Öteki, animasyonla açılan görünen kopyadır. Metin bir kez yazılır,
iki kap da aynı bileşeni çağırır. Böylece ölçülen yükseklik ile
görünen metin ayrışmaz.

SAHA GERÇEKLİĞİ
İmkân listesi boşsa "henüz yazılmadı" satırı basılır. Dizi boş diye
Wi-Fi veya oda tipi uydurulmaz. Kapasite notu varsa duyuru cümlesi
olduğu gibi durur.

DONANIM ENTEGRASYONU
Bu gövde sensör okumaz. Başvuru satırı varsa openPage ile sayfayı açar.
*/
function DetailBody({ dorm, colors, scaleFont }) {
  return (
    <View style={styles.detail}>
      <Text style={[styles.institution, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
        {dorm.institution}
      </Text>
      <Text style={[styles.address, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
        {dorm.address}
      </Text>
      {dorm.capacityNote ? (
        <Text style={[styles.note, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
          {dorm.capacityNote}
        </Text>
      ) : null}
      <Text style={[styles.blockTitle, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
        İmkânlar
      </Text>
      {dorm.amenities.length === 0 ? (
        <Text style={[styles.note, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
          İmkân listesi henüz yazılmadı.
        </Text>
      ) : (
        dorm.amenities.map((item) => (
          <Text
            key={item}
            style={[styles.note, { color: colors.textPrimary, fontSize: scaleFont(14) }]}
          >
            {`· ${item}`}
          </Text>
        ))
      )}
      <Text style={[styles.note, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
        {dorm.amenityNote}
      </Text>
      {dorm.applyUrl ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={dorm.applyLabel}
          onPress={() => openPage(dorm.applyUrl)}
          style={[styles.apply, { borderColor: colors.border }]}
        >
          <Ionicons name="open-outline" size={18} color={colors.accent} />
          <Text style={[styles.applyLabel, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
            {dorm.applyLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export default function DormCard({ dorm }) {
  const { colors, scaleFont } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const progress = useRef(new Animated.Value(0)).current;
  const canCall = Boolean(dorm.phoneTel);

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
  Kapama, gövdeyi yukarı çeker ve animasyon bitince söker. Kapalı kartta
  ayrıntı metni ağaçta durmaz. Gizli bir ikinci kopya ölçülmez.

  SAHA GERÇEKLİĞİ
  Açılan metin, kartın kendi kaydıdır. Başka yurdun imkânı karışmaz.

  DONANIM ENTEGRASYONU
  Animasyon 240 milisaniyedir. Saydamlık JavaScript ile gider. Web'de
  yerli animasyon modülü yoktur. Konum servisi gerekmez.
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
      <DormPhotoSlider photos={dorm.photos} />
      <View style={styles.body}>
        <Text
          accessibilityRole="header"
          style={[styles.name, { color: colors.textPrimary, fontSize: scaleFont(18) }]}
        >
          {dorm.name}
        </Text>
        <View style={styles.badges}>
          <Text style={[styles.badge, styles.genderBadge, { backgroundColor: colors.accent, color: colors.primary, fontSize: scaleFont(12) }]}>
            {dorm.gender}
          </Text>
          <Text style={[styles.badge, { backgroundColor: colors.primary, color: colors.onPrimary, borderColor: colors.accent, fontSize: scaleFont(12) }]}>
            {dorm.typeLabel}
          </Text>
          {dorm.draft ? (
            <Text style={[styles.badge, styles.draftBadge, { borderColor: colors.border, color: colors.textSecondary, fontSize: scaleFont(12) }]}>
              Taslak
            </Text>
          ) : null}
        </View>
        <View style={styles.distanceRow}>
          <Ionicons name="walk-outline" size={18} color={colors.accent} />
          <Text style={[styles.distance, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
            {dorm.distance}
          </Text>
        </View>
        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Haritada yol tarifi al"
            onPress={() => openMap(dorm.latitude, dorm.longitude)}
            style={[styles.action, { backgroundColor: colors.primary, borderColor: colors.accent }]}
          >
            <Ionicons name="navigate-outline" size={18} color={colors.onPrimary} />
            <Text style={[styles.actionLabel, { color: colors.onPrimary, fontSize: scaleFont(13) }]}>
              Haritada Yol Tarifi Al
            </Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={canCall ? 'Yurdu ara' : 'Yurdu ara. Telefon henüz doğrulanmadı.'}
            accessibilityState={{ disabled: !canCall }}
            disabled={!canCall}
            onPress={() => openPhone(dorm.phoneTel)}
            style={[
              styles.action,
              styles.call,
              { borderColor: colors.border, opacity: canCall ? 1 : 0.45 },
            ]}
          >
            <Ionicons name="call-outline" size={18} color={colors.textPrimary} />
            <Text style={[styles.actionLabel, { color: colors.textPrimary, fontSize: scaleFont(13) }]}>
              Yurdu Ara
            </Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open }}
          accessibilityLabel={open ? 'Özellikleri gizle' : 'Tüm özellikleri gör'}
          onPress={toggle}
          style={styles.toggle}
        >
          <Text style={[styles.toggleLabel, { color: colors.accent, fontSize: scaleFont(14) }]}>
            {open ? 'Özellikleri gizle' : 'Tüm özellikleri gör'}
          </Text>
          <Animated.View style={{ transform: [{ rotate: turn }] }}>
            <Ionicons name="chevron-down" size={18} color={colors.accent} />
          </Animated.View>
        </Pressable>
      </View>
      <Animated.View style={{ opacity: progress, transform: [{ translateY: shift }] }}>
        {mounted ? <DetailBody dorm={dorm} colors={colors} scaleFont={scaleFont} /> : null}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  body: {
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
    borderWidth: 1,
    borderColor: 'transparent',
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontWeight: '700',
  },
  genderBadge: {},
  draftBadge: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  distance: {
    flex: 1,
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
  call: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  actionLabel: {
    flexShrink: 1,
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
    paddingHorizontal: 14,
    paddingBottom: 14,
    gap: 8,
  },
  institution: {
    fontWeight: '600',
  },
  address: {
    lineHeight: 20,
  },
  blockTitle: {
    fontWeight: '700',
  },
  note: {
    lineHeight: 20,
  },
  apply: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  applyLabel: {
    fontWeight: '700',
  },
});
