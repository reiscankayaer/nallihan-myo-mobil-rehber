/*
MİMARİ AÇIKLAMA
Şehrimiz sekmesi, ilçe kartları ile ulaşım notlarının ortak kapısıdır.
Başlık her iki alt başlığı da söyler. Faz 1 kabı, canlı bir otobüs
servisine bağlanmaz. Saat ve durak metni daha sonra idarenin yazdığı
belgelerden gelecektir. Ekran şimdiden temaya ve yazı çarpanına bağlıdır.
Koyu mod veya büyük yazı açıldığında bu boş kap da diğer sekmelerle
birlikte değişir.

NEDEN KULLANILDI?
city.js adı, sekme düzenindeki name="city" kaydının dosya karşılığıdır.
Expo Router bu eşleşmeyle sekme düğmesini sayfaya bağlar. İçerik
bileşenleri src altında kaldığı için bu dosya ince bir rota olarak durur.
Kaynak: https://docs.expo.dev/router/advanced/tabs/
*/

import { StyleSheet, Text, View } from 'react-native';

import ScreenFrame from '../../src/components/ScreenFrame';
import { useTheme } from '../../src/context/ThemeContext';

export default function SehirScreen() {
  const { colors, scaleFont } = useTheme();

  return (
    <ScreenFrame>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(28) }]}
      >
        Şehrimiz & Ulaşım
      </Text>
      <View
        accessibilityLabel="Şehir ve ulaşım içeriğinin geleceği alan"
        style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.containerTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
          İlçe ve güzergâh
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(16) }]}>
          Sağlık, market ve kamu noktaları ile Ankara–Nallıhan tarifi bu kabın içine
          gelecek. Saatler idarenin yazdığı metin olacak. Canlı ulaşım servisi bu
          sürüme alınmadı.
        </Text>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
  container: {
    borderWidth: 1,
    borderRadius: 12,
    borderStyle: 'dashed',
    padding: 16,
    gap: 8,
    minHeight: 160,
    justifyContent: 'center',
  },
  containerTitle: {
    fontWeight: '700',
  },
  body: {
    lineHeight: 22,
  },
});
