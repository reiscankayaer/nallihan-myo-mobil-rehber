/*
MİMARİ AÇIKLAMA
Yurt kartının üstü bir fotoğraf şerididir. Öğrenci parmağıyla sağa sola
geçer. Sayaç, kaçıncı karede olduğunu söyler. Şerit otomatik kaymaz.
Yurt fotoğrafı kampüs karşılama panosu değildir. Öğrenci kareyi kendi seçer.

SAHA GERÇEKLİĞİ
Adresler yer tutucudur. Sayaç "1 / 3" der. Sol alttaki yazı, karenin bu
binanın fotoğrafı olmadığını söyler. Gerçek cephe gelince veri dosyasındaki
url değişir. Bu bileşen adresi kendisi seçmez.

DONANIM ENTEGRASYONU
Kaydırma, parmağın yatay hareketidir. Kamera açılmaz, galeriye yazılmaz.
Genişlik önce kartın onLayout ölçüsüdür. Ölçüm gelene kadar pencere
genişliğinden yan pay düşülür. Böylece ilk kare bir piksel genişliğinde
kalmaz.
*/

import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';

const FRAME_HEIGHT = 176;

/*
MİMARİ AÇIKLAMA
Sayaç, piksel kaymasına değil oturmuş sayfaya bakar. Yarım kaydırma
bir sonraki kareyi seçmez. Yuvarlama, sayfanın çoğuna geçilince olur.

SAHA GERÇEKLİĞİ
Fonksiyon fotoğrafın gerçek binaya ait olup olmadığına bakmaz. Yalnızca
kaçıncı yer tutucunun ekranda olduğunu hesaplar.

DONANIM ENTEGRASYONU
offset, kaydırıcının contentOffset.x değeridir. Genişlik sıfırken,
ölçüm gelmeden, indeks 0 kalır. Böylece ilk karede bölme hatası olmaz.
*/
function indexFromOffset(offset, width, count) {
  if (!width || count < 1) {
    return 0;
  }
  const raw = Math.round(offset / width);
  return Math.max(0, Math.min(count - 1, raw));
}

export default function DormPhotoSlider({ photos }) {
  const { colors, scaleFont } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const [measured, setMeasured] = useState(0);
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const slideWidth = measured || Math.max(windowWidth - 34, 280);

  return (
    <View
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        if (next > 0 && next !== measured) {
          setMeasured(next);
        }
      }}
      style={styles.frame}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={slideWidth}
        disableIntervalMomentum
        onMomentumScrollEnd={(event) => {
          setIndex(indexFromOffset(event.nativeEvent.contentOffset.x, slideWidth, count));
        }}
      >
        {photos.map((photo) => (
          <View key={photo.id} style={{ width: slideWidth, height: FRAME_HEIGHT }}>
            <Image
              source={{ uri: photo.url }}
              accessibilityLabel={`Örnek görsel. Bu binanın fotoğrafı değil.`}
              resizeMode="cover"
              style={styles.photo}
            />
          </View>
        ))}
      </ScrollView>
      <View style={[styles.sample, { backgroundColor: colors.primary }]} pointerEvents="none">
        <Text style={[styles.sampleText, { color: colors.onPrimary, fontSize: scaleFont(11) }]}>
          Örnek görsel
        </Text>
      </View>
      <View style={[styles.counter, { backgroundColor: colors.accent }]} pointerEvents="none">
        <Text style={[styles.counterText, { color: colors.primary, fontSize: scaleFont(12) }]}>
          {`${index + 1} / ${count}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: FRAME_HEIGHT,
    backgroundColor: '#12234A',
  },
  photo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#12234A',
  },
  sample: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sampleText: {
    fontWeight: '700',
  },
  counter: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderRadius: 999,
    minWidth: 44,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  counterText: {
    fontWeight: '700',
  },
});
