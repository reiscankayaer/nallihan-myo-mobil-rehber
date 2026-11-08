/*
MİMARİ AÇIKLAMA
Şehrimiz sekmesi, ilçe rehberinin tek dikey sayfasıdır. En üstte beş
saniyelik şehir şeridi durur. Altında sanal tur düğmesi, sonra üç
kategori çipi, en altta seçilen kategorinin kartları gelir. İkinci bir
dikey liste açılmaz. Şerit yatay kayar. Sayfa dikey kayar. Dosya adı
city.js, sekmedeki name="city" ile birebir eşleşir.

ADMİN PANELİ ENTEGRASYONU
Ekran veri uydurmaz. filterCityPlaces, seçilen kategori kodunu kataloga
sorar. Panel sehir koleksiyonunu doldurunca aynı kodlar aynı çiplere
düşer. Sanal tur düğmesi bir yayın değildir. Modül yazılana kadar
yalnızca hazırlık mesajı verir.

SAHA GERÇEKLİĞİ
Çipler ulaşım, sosyal yaşam ve geziyi ayırır. Saat ve ücret kartın
içinde, kurum sayfasına bırakılmış not olarak durur. Bu ekran canlı
otobüs servisine bağlanmaz. Konum izni istenmez.
*/

import { useMemo, useState } from 'react';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import ScreenFrame from '../../src/components/ScreenFrame';
import CityHeroSlider from '../../src/components/CityHeroSlider';
import CityPlaceCard from '../../src/components/CityPlaceCard';
import { CITY_CATEGORIES, CITY_SLIDES, filterCityPlaces } from '../../src/data/cityData';
import { useTheme } from '../../src/context/ThemeContext';

/*
MİMARİ AÇIKLAMA
Sanal tur düğmesi büyük ve tek başına durur. Jüri bu düğmeyi görür.
Basılınca tur açılmaz. Sistem uyarısı, modülün henüz yazılmadığını söyler.
Böylece boş bir WebView veya kırık panorama bağlanmaz.

ADMİN PANELİ ENTEGRASYONU
Tur adresi panelde yoktur. Modül gelince bu fonksiyonun içindeki uyarı,
gerçek tur adresine bırakılır. Düğmenin yeri ve metni kalır.

SAHA GERÇEKLİĞİ
Uyarı metni "Sanal tur modülü hazırlanıyor" cümlesidir. İlçenin
çekilmiş bir 360 turu varmış gibi davranılmaz. Konum ve kamera açılmaz.
Web'de React Native Alert boş bir fonksiyondur. Bu yüzden aynı cümle
düğmenin altında da yazılır. Telefonda sistem uyarısı açılır.
*/
function showTourMessage(onWeb) {
  if (Platform.OS === 'web') {
    onWeb();
    return;
  }
  Alert.alert('Sanal tur', 'Sanal tur modülü hazırlanıyor.');
}

/*
MİMARİ AÇIKLAMA
Üç çip tek seçimdir. Biri doluyken ötekiler boşalır. Seçili çip altın
zemin ve lacivert yazı kullanır. Koyu kartın üstünde lacivert üstüne
lacivert yazı kalmaz. Boş çip, kart zemini ve çerçeve ile durur.

ADMİN PANELİ ENTEGRASYONU
Çip kimliği CITY_CATEGORIES kaydındaki id değeridir. Panel yeni kategori
eklerse bu diziye bir satır eklenir. Ekran etiket metnini kendisi yazmaz.

SAHA GERÇEKLİĞİ
Basış, dokunmatik hedeftir. Yükseklik 44 noktanın altına inmez.
Süzgeç sensör okumaz. Yalnızca bellekteki diziyi keser.
*/
function CategoryChips({ selected, onSelect }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View style={styles.chips}>
      {CITY_CATEGORIES.map((category) => {
        const active = category.id === selected;
        return (
          <Pressable
            key={category.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(category.id)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.accent : colors.card,
                borderColor: active ? colors.accent : colors.border,
              },
            ]}
          >
            <Text
              style={{
                color: active ? colors.primary : colors.textPrimary,
                fontSize: scaleFont(13),
                fontWeight: '700',
              }}
            >
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function SehirScreen() {
  const { colors, scaleFont } = useTheme();
  const [category, setCategory] = useState('transport');
  const [tourNote, setTourNote] = useState(false);
  const places = useMemo(() => filterCityPlaces(category), [category]);

  return (
    <ScreenFrame>
      <CityHeroSlider slides={CITY_SLIDES} />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Kampüs ve çarşı 360 derece sanal tur, yakında"
        onPress={() => showTourMessage(() => setTourNote(true))}
        style={[styles.tour, { backgroundColor: colors.primary, borderColor: colors.accent }]}
      >
        <Ionicons name="scan-outline" size={28} color={colors.accent} />
        <View style={styles.tourText}>
          <Text style={[styles.tourTitle, { color: colors.onPrimary, fontSize: scaleFont(16) }]}>
            Kampüs & Çarşı 360° Sanal Tur (Yakında)
          </Text>
          <Text style={[styles.tourLead, { color: colors.onPrimary, fontSize: scaleFont(13) }]}>
            Modül hazır olunca bu düğme turu açacak.
          </Text>
        </View>
      </Pressable>
      {tourNote ? (
        <Text style={[styles.tourNote, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
          Sanal tur modülü hazırlanıyor.
        </Text>
      ) : null}
      <CategoryChips selected={category} onSelect={setCategory} />
      {places.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
          Bu kategoride kayıt yok.
        </Text>
      ) : (
        places.map((place) => <CityPlaceCard key={place.id} place={place} />)
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  tour: {
    minHeight: 76,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tourText: {
    flex: 1,
    gap: 4,
  },
  tourTitle: {
    fontWeight: '700',
  },
  tourLead: {
    lineHeight: 18,
    opacity: 0.9,
  },
  tourNote: {
    fontWeight: '700',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    lineHeight: 22,
  },
});
