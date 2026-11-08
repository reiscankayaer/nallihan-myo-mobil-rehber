/*
MİMARİ AÇIKLAMA
Yurtlarımız sekmesi, barınma kayıtlarının listesidir. Üstte başlık ve
uyarı kutusu durur. Altında dört süzgeç çipi, sonra yurt kartları gelir.
Kartın içindeki şerit yatay kayar. Sayfanın kendisi dikey kayar. İki
kaydırma ekseni ayrıdır. İkinci bir dikey liste açılmaz. Üç kart
sanal listeye konmaz. Sanal liste, bu kadar kısa bir katalogda kartı
kaydırırken yeniden kurar.

SAHA GERÇEKLİĞİ
Uyarı kutusunun ilk cümlesi kesindir: ilçede kız KYK yurdu yoktur.
İkinci cümle, yüksekokulun kendi kız öğrenci lojmanını söyler. Özel
pansiyon cümlesi ekrana basılmaz. Çünkü okul sayfası kız barınmasını
32 kişilik lojman diye duyurur. Süzgeçteki "Kız Lojmanı" çipi bu kaydın
türüdür. "Özel Kız" çipi, doğrulanmamış bir işletme varmış gibi
gösterilmez.

DONANIM ENTEGRASYONU
Bu ekran haritayı ve çeviriciyi kendisi açmaz. O iş karttaki düğmelerdedir.
Süzgeç bir sensör değildir. Seçilen tür, bellekteki diziyi keser.
Dosya adı dorms.js, sekme adıyla birebir eşleşir.
*/

import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import ScreenFrame from '../../src/components/ScreenFrame';
import DormCard from '../../src/components/DormCard';
import { DORM_FILTERS, filterDorms } from '../../src/data/dormsData';
import { useTheme } from '../../src/context/ThemeContext';

/*
MİMARİ AÇIKLAMA
Uyarı kutusu listenin üstünde, süzgeçten önce durur. Öğrenci kartlara
inmeden kız KYK olmadığını okur. Kutu bir modal değildir. Sayfayla
birlikte kayar.

SAHA GERÇEKLİĞİ
Metin, bakanlık listesinde Nallıhan kız KYK kaydı olmamasına ve
yüksekokulun lojman duyurusuna dayanır. Özel pansiyon önerisi yazılmaz.

DONANIM ENTEGRASYONU
Kutu konum istemez, arama başlatmaz. Yalnızca ikon ve iki cümle çizer.
*/
function Callout() {
  const { colors, scaleFont } = useTheme();

  return (
    <View style={[styles.callout, { backgroundColor: colors.card, borderColor: colors.accent }]}>
      <Ionicons name="alert-circle" size={22} color={colors.accent} />
      <Text style={[styles.calloutText, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>
        Önemli not: Nallıhan ilçesinde kız KYK yurdu bulunmamaktadır. Kız öğrenciler,
        yüksekokulun 32 kişilik kız öğrenci lojmanına öğrenci işleri üzerinden başvurur.
        Başvuru bu uygulamada toplanmaz.
      </Text>
    </View>
  );
}

/*
MİMARİ AÇIKLAMA
Çipler tek seçimdir. Biri doluyken öteki boşalır. Seçili çip altın zemin
ve lacivert yazı kullanır. Koyu kartın üstünde lacivert üstüne lacivert
yazı kalmaz. Boş çip, kart zemini ve çerçeve ile durur.

SAHA GERÇEKLİĞİ
Çip kimlikleri veri dosyasındaki type değerleridir. Etiket değişse de
süzgeç aynı kodu keser.

DONANIM ENTEGRASYONU
Basış, dokunmatik hedeftir. Yükseklik 44 noktanın altına inmez.
Konum veya rehber izni istenmez.
*/
function FilterChips({ selected, onSelect }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View style={styles.chips}>
      {DORM_FILTERS.map((filter) => {
        const active = filter.id === selected;
        return (
          <Pressable
            key={filter.id}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(filter.id)}
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
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function YurtlarScreen() {
  const { colors, scaleFont } = useTheme();
  const [filter, setFilter] = useState('all');
  const dorms = useMemo(() => filterDorms(filter), [filter]);

  return (
    <ScreenFrame>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(28) }]}
      >
        Yurtlarımız
      </Text>
      <Callout />
      <FilterChips selected={filter} onSelect={setFilter} />
      {dorms.length === 0 ? (
        <Text style={[styles.empty, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
          Bu süzgeçte kayıt yok.
        </Text>
      ) : (
        dorms.map((dorm) => <DormCard key={dorm.id} dorm={dorm} />)
      )}
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
  callout: {
    borderWidth: 1,
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  calloutText: {
    flex: 1,
    lineHeight: 21,
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
