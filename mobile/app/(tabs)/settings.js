/*
MİMARİ AÇIKLAMA
Ayarlar sekmesi, Faz 1'de tema motorunun canlı denemesidir. Koyu mod
anahtarı ve üç yazı düzeyi, ThemeContext'teki durumu değiştirir. Değişen
değer aynı anda bu ekrana, diğer sekmelere ve cihaz deposuna yansır.
Tercih bir kullanıcı hesabına yazılmaz. Rehber girişsiz kalır. İleride
hakkında ve gizlilik metni de bu sekmede duracaktır. Şimdilik ekranın
işi, seçimin kalıcı olduğunu sınıfta gösterebilmektir.

NEDEN KULLANILDI?
React Native Switch ve Pressable, ek paket olmadan anahtar ve seçim
düğmesi verir. Pressable, dokunulan yüzeyin kendisidir ve erişilebilirlik
rolü alabilir. Üç düzey ThemeContext içindeki FONT_SIZE_LEVELS tablosundan
üretilir. Çarpanlar bu dosyada ikinci kez yazılmaz. Böylece 0.9, 1.0 ve
1.15 tek yerde kalır.
*/

import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import ScreenFrame from '../../src/components/ScreenFrame';
import { FONT_SIZE_LEVELS, useTheme } from '../../src/context/ThemeContext';

const LEVEL_LABEL = {
  small: 'Küçük',
  normal: 'Normal',
  large: 'Büyük',
};

export default function AyarlarScreen() {
  const { colors, mode, fontSizeLevel, setFontSizeLevel, toggleMode, scaleFont } = useTheme();
  const dark = mode === 'dark';

  return (
    <ScreenFrame>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(28) }]}
      >
        Ayarlar
      </Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.row}>
          <View style={styles.rowText}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
              Koyu mod
            </Text>
            <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
              {dark ? 'Koyu palet açık.' : 'Açık palet açık.'} Seçim bu cihazda saklanır.
            </Text>
          </View>
          <Switch
            accessibilityRole="switch"
            accessibilityLabel="Koyu mod"
            accessibilityState={{ checked: dark }}
            value={dark}
            onValueChange={toggleMode}
            trackColor={{ false: '#94A3B8', true: colors.accent }}
            thumbColor={colors.onPrimary}
            ios_backgroundColor="#94A3B8"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
          Yazı boyutu
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
          Küçük 0,9 kat, normal 1 kat, büyük 1,15 kattır.
        </Text>
        <View style={styles.levels}>
          {Object.keys(FONT_SIZE_LEVELS).map((level) => {
            const selected = fontSizeLevel === level;
            return (
              <Pressable
                key={level}
                accessibilityRole="button"
                accessibilityLabel={`${LEVEL_LABEL[level]} yazı boyutu`}
                accessibilityState={{ selected }}
                onPress={() => setFontSizeLevel(level)}
                style={[
                  styles.levelButton,
                  {
                    backgroundColor: selected ? colors.accent : colors.background,
                    borderColor: selected ? colors.accent : colors.border,
                  },
                ]}
              >
                <Text
                  style={{
                    color: selected ? colors.primary : colors.textPrimary,
                    fontSize: scaleFont(15),
                    fontWeight: '700',
                  }}
                >
                  {LEVEL_LABEL[level]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
          Önizleme
        </Text>
        <Text style={[styles.body, { color: colors.textSecondary, fontSize: scaleFont(16) }]}>
          Nallıhan MYO rehberi bu puntoyla okunur. Ayarlar kapanınca da aynı kalır.
        </Text>
      </View>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontWeight: '700',
  },
  body: {
    lineHeight: 22,
  },
  levels: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  levelButton: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
