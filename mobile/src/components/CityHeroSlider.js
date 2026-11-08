/*
MİMARİ AÇIKLAMA
Karşılama şeridi ilçenin üç yüzünü sırayla gösterir. Her kare bir sayfadır.
Beş saniyede bir sonraki sayfaya geçer. Sonda başa döner. Karartma,
fotoğrafın altını koyulaştırır. Ad ve kısa cümle sol altta beyaz durur.
Yazı, tema rengiyle boyanmaz. Koyu ve açık modda zemin fotoğraftır.
Beyaz, koyu örtünün üstünde kalır.

ADMİN PANELİ ENTEGRASYONU
Karelerin adresi, başlığı ve cümlesi CITY_SLIDES dizisindendir. Panel
gerçek ilçe fotoğrafını url alanına yazınca bu bileşen aynı çerçeveyi
kullanır. Süre bileşendedir. Panel süreyi değiştirmez. Beş saniye,
sunumdaki sözleşmedir.

SAHA GERÇEKLİĞİ
Adresler Unsplash yer tutucusudur. Sol üstteki yazı, karenin o yerin
fotoğrafı olmadığını söyler. Kuş cenneti, han ve seyir terası adları
rehberin gezi başlıklarıdır. Görsel, o kapının çekimi değildir.
*/

import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Image, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../context/ThemeContext';

const SLIDE_INTERVAL_MS = 5000;
const SLIDE_HEIGHT = 210;

/*
MİMARİ AÇIKLAMA
Sayaç, kaydırma pikselini sayfa indeksine çevirir. Zamanlayıcı ile parmak
aynı indeksi paylaşsın diye sonuç sınırın içine çekilir. Yarım kalan
kaydırma, sayfanın çoğuna geçilince sonraki kareyi seçer.

ADMİN PANELİ ENTEGRASYONU
Fonksiyon başlık veya fotoğraf adresi bilmez. Panel kaç kare koyarsa
count o kadar olur. Yeni kare, hesabın formülünü değiştirmez.

SAHA GERÇEKLİĞİ
Genişlik sıfırken, ölçüm gelmeden, indeks 0 kalır. Bölme hatası oluşmaz.
Fonksiyon görselin gerçek yer olup olmadığına bakmaz.
*/
function indexFromOffset(offset, width, count) {
  if (!width || count < 1) {
    return 0;
  }
  const raw = Math.round(offset / width);
  return Math.max(0, Math.min(count - 1, raw));
}

export default function CityHeroSlider({ slides }) {
  const { scaleFont } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const scrollerRef = useRef(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const count = slides.length;
  const slideWidth = width || Math.max(windowWidth - 34, 280);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReduceMotion(enabled);
      }
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  /*
  MİMARİ AÇIKLAMA
  Zamanlayıcı beş saniyede bir kurulur ve bileşen sökülünce temizlenir.
  Temizlik, ekrandan çıkınca da süren bir kaydırmayı keser. Bu, bellek
  sızıntısını ve görünmeyen ekranda scrollTo çağrısını önler. Parmak
  şeridi tutunca tur atlanır. Bırakınca aynı beş saniye kaldığı yerden sürer.

  ADMİN PANELİ ENTEGRASYONU
  Aralık sabit 5000 milisaniyedir. Panel bu sayıyı değiştirmez. Kare
  listesi değişirse etki yeniden kurulur. Eski zamanlayıcı dönüşte silinir.
  İki zamanlayıcı aynı anda kare ilerletmez.

  SAHA GERÇEKLİĞİ
  Sistem azaltılmış hareket istiyorsa zamanlayıcı hiç kurulmaz. Kareler
  durur. Öğrenci parmağıyla geçer. Otomatik kaydırma bir duyuru değildir.
  */
  useEffect(() => {
    if (!slideWidth || count < 2 || reduceMotion) {
      return undefined;
    }
    const timer = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      const next = (indexRef.current + 1) % count;
      indexRef.current = next;
      setIndex(next);
      scrollerRef.current?.scrollTo({ x: next * slideWidth, animated: true });
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [slideWidth, count, reduceMotion]);

  return (
    <View
      onLayout={(event) => {
        const next = Math.round(event.nativeEvent.layout.width);
        if (next > 0 && next !== width) {
          setWidth(next);
        }
      }}
      style={styles.frame}
    >
      <ScrollView
        ref={scrollerRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={slideWidth}
        disableIntervalMomentum
        onScrollBeginDrag={() => {
          pausedRef.current = true;
        }}
        onScrollEndDrag={(event) => {
          if (event.nativeEvent.velocity?.x === 0) {
            pausedRef.current = false;
          }
        }}
        onMomentumScrollEnd={(event) => {
          const next = indexFromOffset(event.nativeEvent.contentOffset.x, slideWidth, count);
          indexRef.current = next;
          setIndex(next);
          pausedRef.current = false;
        }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width: slideWidth, height: SLIDE_HEIGHT }}>
            <Image
              source={{ uri: slide.url }}
              accessibilityLabel={`${slide.title}. Örnek görsel, bu yerin fotoğrafı değil.`}
              resizeMode="cover"
              style={styles.photo}
            />
          </View>
        ))}
      </ScrollView>
      <LinearGradient
        colors={['rgba(15,23,42,0)', 'rgba(15,23,42,0.15)', 'rgba(15,23,42,0.88)']}
        style={styles.shade}
        pointerEvents="none"
      />
      <View style={styles.sample} pointerEvents="none">
        <Text style={[styles.sampleText, { fontSize: scaleFont(11) }]}>Örnek görsel</Text>
      </View>
      <View style={styles.caption} pointerEvents="none">
        <Text style={[styles.title, { fontSize: scaleFont(20) }]}>{slides[index]?.title}</Text>
        <Text style={[styles.lead, { fontSize: scaleFont(14) }]}>{slides[index]?.caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    height: SLIDE_HEIGHT,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#12234A',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  shade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
  },
  sample: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15,23,42,0.72)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sampleText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  caption: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 12,
    gap: 2,
  },
  title: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  lead: {
    color: '#FFFFFF',
  },
});
