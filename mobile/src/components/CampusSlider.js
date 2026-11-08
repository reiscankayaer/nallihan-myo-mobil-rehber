/*
MİMARİ GEREKÇE
Karşılama şeridi, kampüsün dört yüzünü tek bakışta geçirir. Her pano bir
sayfadır. Noktalar hangi sayfada olunduğunu söyler. Parmak sayfayı tutunca
otomatik geçiş durur. Bırakınca kaldığı yerden sürer. Fotoğraf dosyası
yoktur. Pano, kurumsal lacivert ve altınla çizilir. image alanı dolunca
aynı çerçeve o görseli basar. Başlık ve süre değişmez.

PERFORMANS NOTU
Dört pano bellekte durur. Üç slaytı pencereden atmak, sonraki kareye
geçerken yeniden kurulum demektir. Bu yüzden yatay ScrollView kullanılır,
sanal liste kullanılmaz. Zamanlayıcı tektir. Nokta, her karede değil,
sayfa oturunca güncellenir.

NASIL ÇALIŞIR?
Genişlik, şeridin onLayout ölçüsüdür. Dört saniyede bir scrollTo bir
sayfa ileri gider. Sona gelince başa döner. onTouchStart ve sürükleme
başlangıcı zamanlayıcıyı susturur. Parmak kalkıp kaydırma bitince sürer.
Sistem azaltılmış hareket istiyorsa zamanlayıcı hiç kurulmaz. Noktaya
basmak o sayfaya gider.
*/

import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';

const SLIDE_INTERVAL_MS = 4000;
const SLIDE_HEIGHT = 168;

/*
MİMARİ GEREKÇE
Sayaç ile ekrandaki nokta aynı indeksi göstermelidir. Render kapandığında
okunan state eski kalabilir. Ref, zamanlayıcının o anki sayfayı görmesini
sağlar. State, noktanın yeniden çizilmesi içindir.

PERFORMANS NOTU
setIndex yalnızca sayfa değişince çağrılır. Kaydırma süresince her pikselde
çizim yapılmaz.

NASIL ÇALIŞIR?
offset, sayfa genişliğine bölünüp yuvarlanır. Sonuç dizi sınırına çekilir.
Aynı indekse tekrar setState yapılmaz.
*/

function indexFromOffset(offset, width, count) {
  if (!width || count < 1) {
    return 0;
  }
  const raw = Math.round(offset / width);
  return Math.max(0, Math.min(count - 1, raw));
}

export default function CampusSlider({ slides }) {
  const { colors, scaleFont } = useTheme();
  const scrollerRef = useRef(null);
  const indexRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  /*
  MİMARİ GEREKÇE
  Otomatik kaydırma bir süs değildir. Hareketi azaltmış kullanıcıda slayt
  kendi kendine gitmez. Seçim, işletim sisteminin ayarıdır.

  PERFORMANS NOTU
  Dinleyici bir kez kurulur, sökülünce kalkar. Her kaydırmada yeniden
  sorulmaz.

  NASIL ÇALIŞIR?
  isReduceMotionEnabled ilk değeri okur. reduceMotionChanged sonradan
  değişirse state güncellenir ve alttaki zamanlayıcı etkisi yeniden kurulur.
  */
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted) {
        setReduceMotion(enabled);
      }
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduceMotion,
    );
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  /*
  MİMARİ GEREKÇE
  Geçiş, genişlik bilinmeden hesaplanamaz. Genişlik şeridin kendi
  ölçüsüdür. Pencere genişliğinden pay çıkarmak, yatay boşluk değişince
  sayfayı kaydırır.

  PERFORMANS NOTU
  Tek setInterval vardır. Parmak basılıyken gövde hemen döner, kaydırma
  çağrılmaz. Bileşen sökülünce aralık temizlenir.

  NASIL ÇALIŞIR?
  Her dört saniyede indeks bir artar, son sayfadan sonra sıfıra döner.
  scrollTo o ofsete gider. pausedRef doğruysa bu tur atlanır.
  */
  useEffect(() => {
    if (!width || reduceMotion || slides.length < 2) {
      return undefined;
    }

    const timer = setInterval(() => {
      if (pausedRef.current) {
        return;
      }
      const next = (indexRef.current + 1) % slides.length;
      indexRef.current = next;
      setIndex(next);
      scrollerRef.current?.scrollTo({ x: next * width, animated: true });
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [width, reduceMotion, slides.length]);

  function commitIndex(offset) {
    const next = indexFromOffset(offset, width, slides.length);
    indexRef.current = next;
    setIndex(next);
  }

  function goTo(next) {
    if (!width) {
      return;
    }
    pausedRef.current = true;
    indexRef.current = next;
    setIndex(next);
    scrollerRef.current?.scrollTo({
      x: next * width,
      animated: !reduceMotion,
    });
    pausedRef.current = false;
  }

  return (
    <View
      onLayout={(event) => {
        const nextWidth = Math.round(event.nativeEvent.layout.width);
        if (nextWidth !== width) {
          setWidth(nextWidth);
        }
      }}
    >
      <ScrollView
        ref={scrollerRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={width || undefined}
        snapToAlignment="start"
        disableIntervalMomentum
        onTouchStart={() => {
          pausedRef.current = true;
        }}
        onScrollBeginDrag={() => {
          draggingRef.current = true;
          pausedRef.current = true;
        }}
        onScrollEndDrag={(event) => {
          const velocity = event.nativeEvent.velocity?.x ?? 0;
          if (velocity === 0) {
            draggingRef.current = false;
            pausedRef.current = false;
            commitIndex(event.nativeEvent.contentOffset.x);
          }
        }}
        onMomentumScrollEnd={(event) => {
          draggingRef.current = false;
          pausedRef.current = false;
          commitIndex(event.nativeEvent.contentOffset.x);
        }}
        accessibilityLabel="Kampüs tanıtım şeridi"
      >
        {slides.map((slide) => {
          const background = slide.tone === 'accent' ? colors.accent : colors.primary;
          const foreground = slide.tone === 'accent' ? colors.primary : colors.onPrimary;
          return (
            <View
              key={slide.id}
              accessibilityLabel={`${slide.title}. ${slide.caption}`}
              style={[styles.slide, { width: width || '100%', backgroundColor: background }]}
            >
              <Ionicons name={slide.icon} size={28} color={foreground} />
              <Text style={[styles.slideTitle, { color: foreground, fontSize: scaleFont(20) }]}>
                {slide.title}
              </Text>
              <Text style={[styles.slideCaption, { color: foreground, fontSize: scaleFont(14) }]}>
                {slide.caption}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.dots} accessibilityRole="tablist">
        {slides.map((slide, dotIndex) => {
          const active = dotIndex === index;
          return (
            <Pressable
              key={slide.id}
              accessibilityRole="tab"
              accessibilityLabel={`${dotIndex + 1}. pano`}
              accessibilityState={{ selected: active }}
              onPress={() => goTo(dotIndex)}
              hitSlop={8}
              style={styles.dotHit}
            >
              <View
                style={[
                  styles.dot,
                  {
                    width: active ? 18 : 8,
                    backgroundColor: active ? colors.accent : colors.tabInactive,
                  },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    height: SLIDE_HEIGHT,
    borderRadius: 12,
    padding: 16,
    justifyContent: 'flex-end',
    gap: 4,
  },
  slideTitle: {
    fontWeight: '700',
  },
  slideCaption: {
    lineHeight: 20,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  dotHit: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});
