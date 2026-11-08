/*
MİMARİ AÇIKLAMA
ScreenFrame, dört sekmenin ortak iskeletidir. Sayfa zemini temanın arka
planıdır. İçerik, çentiğin altında ve sekme çubuğunun üstünde kayar.
Üst, sol ve sağ pay çentik içindir. Alt pay çubuğa bırakılmaz. Expo Router
sekme sahnesini çubuğun üstünde sonlandırır. Çerçeve, esnek kutunun
içerik kadar büyüyüp menünün üstüne taşmasını minHeight: 0 ile keser.
Kaydırınca kartın devamı çubuğun hemen üstünde görünür.

NEDEN KULLANILDI?
react-native-safe-area-context içindeki SafeAreaView, çentik ve durum
çubuğu kadar içeriği iter. React Native'in kendi SafeAreaView bileşeni
bu projede kullanılmaz. Expo, cihaz payı için bu kütüphaneyi belgeler.
Alt çubuğun yüksekliği ayrıca ölçülmez. Gezgin o yüksekliği sahnenin
dışında tutar. İkinci bir alt boşluk, kart ile menü arasında boş şerit açar.
Kaynak: https://docs.expo.dev/develop/user-interface/safe-areas/
Kaynak: https://docs.expo.dev/router/advanced/tabs/
*/

import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '../context/ThemeContext';

export default function ScreenFrame({ children }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.frame, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scroller}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
  },
  scroller: {
    flex: 1,
    minHeight: 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 12,
  },
});
