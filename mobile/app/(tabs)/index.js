/*
MİMARİ AÇIKLAMA
index, (tabs) grubunun varsayılan rotasıdır. Uygulama açılınca Üniversitemiz
sekmesi gelir. Bu fazda ekran üç iş görür: bölümün başlığı, okulun kısa
karşılama kartı ve temanin gerçekten değiştiğini gösteren bir deneme alanı.
Kartlardaki metin idare içeriğinin yer tutucusudur. Fazın ilerisinde aynı
kartlar Firestore'dan gelen kurum belgesiyle dolar. Renk ve punto burada
sabitlenmez, useTheme üzerinden gelir.

NEDEN KULLANILDI?
Dosya adı index olduğu için Expo Router bu sayfayı grubun kök adresi sayar.
Ayrı bir başlangıç bileşeni veya elle yazılmış initialRouteName gerekmez.
Kaynak: https://docs.expo.dev/router/advanced/tabs/
*/

import { StyleSheet, Text, View } from 'react-native';

import ScreenFrame from '../../src/components/ScreenFrame';
import { useTheme } from '../../src/context/ThemeContext';

const LEVEL_LABEL = {
  small: 'Küçük',
  normal: 'Normal',
  large: 'Büyük',
};

export default function UniversitemizScreen() {
  const { colors, mode, fontSizeLevel, scaleFont } = useTheme();

  return (
    <ScreenFrame>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(28) }]}
      >
        Üniversitemiz
      </Text>
      <Text style={[styles.lead, { color: colors.textSecondary, fontSize: scaleFont(16) }]}>
        Ankara Üniversitesi Nallıhan Meslek Yüksekokulu öğrenci ve aday öğrenci rehberi.
      </Text>

      <View
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
          Hoş geldiniz
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(16) }]}>
          Hesap açmadan okulun birimlerine, yurtlara, ilçeye ve acil numaralara buradan
          ulaşılır. İçerik okul idaresinin yönetim panelinden yayınlanır.
        </Text>
      </View>

      <View
        accessibilityLabel="Tema deneme alanı"
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
          Tema denemesi
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(16) }]}>
          {`Görünüm: ${mode === 'dark' ? 'Koyu' : 'Açık'}. Yazı: ${LEVEL_LABEL[fontSizeLevel]}. Bu cümle seçilen çarpanla büyür.`}
        </Text>
        <View style={styles.swatches}>
          <View style={[styles.swatch, { backgroundColor: colors.primary }]}>
            <Text style={[styles.swatchLabel, { color: colors.onPrimary, fontSize: scaleFont(13) }]}>
              Lacivert
            </Text>
          </View>
          <View style={[styles.swatch, { backgroundColor: colors.accent }]}>
            <Text style={[styles.swatchLabel, { color: colors.primary, fontSize: scaleFont(13) }]}>
              Altın
            </Text>
          </View>
        </View>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
  lead: {
    lineHeight: 22,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontWeight: '700',
  },
  body: {
    lineHeight: 22,
  },
  swatches: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  swatch: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  swatchLabel: {
    fontWeight: '700',
  },
});
