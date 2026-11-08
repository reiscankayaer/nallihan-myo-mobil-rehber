/*
MİMARİ AÇIKLAMA
Yurtlarımız sekmesi, yurt kartlarının duracağı ekrandır. Faz 1'de liste
bilerek boştur. Kartın alanları (ad, tür, adres, telefon, yol tarifi)
henüz Firestore'a bağlı değildir. Bu dosya o listenin yerleşeceği kabı
ve başlığı hazır tutar. Böylece veri katmanı geldiğinde gezgin ve tema
yeniden yazılmaz, yalnızca kabın içi dolar.

NEDEN KULLANILDI?
Dosya adı dorms.js, sekme düzenindeki Tabs.Screen name="dorms" değeriyle
birebir eşleşir. Expo Router eşleşmeyen isimde ekranı bulamaz. Ayrı bir
rota tablosu tutulmaz.
Kaynak: https://docs.expo.dev/router/advanced/tabs/
*/

import { StyleSheet, Text, View } from 'react-native';

import ScreenFrame from '../../src/components/ScreenFrame';
import { useTheme } from '../../src/context/ThemeContext';

export default function YurtlarScreen() {
  const { colors, scaleFont } = useTheme();

  return (
    <ScreenFrame>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(28) }]}
      >
        Yurtlarımız
      </Text>
      <View
        accessibilityLabel="Yurt listesinin geleceği alan"
        style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}
      >
        <Text style={[styles.containerTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
          Yurt listesi
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(16) }]}>
          KYK, okul ve diğer yurt kartları yönetim panelinden yayınlanınca bu alanda
          sıralanacak. Başvuru bu uygulamada toplanmaz. Kart, resmî başvuru adresini gösterir.
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
