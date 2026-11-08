/*
MİMARİ GEREKÇE
Kısayol ve bölüm ayrıntısı aynı kabı kullanır. Kabın işi başlığı, kapatma
düğmesini ve içerik alanını çizmektir. İçerik, çağıran ekranın çocuklarıdır.
Böylece yemekhane metni ile bölüm kartı iki ayrı pencere bileşeni olmaz.

PERFORMANS NOTU
Pencere kapalıyken web katmanı kurulmaz. iOS ve Android'de Modal ağaçta
kalır ama görünmez. Açıkken tek kart vardır.

NASIL ÇALIŞIR?
visible true olunca tam ekran bir perde ve ortada kart açılır. Kapatma,
perdeye basmak, X düğmesi veya Android geri tuşu ile olur. Üçü de
onClose çağırır.
*/

import { Dimensions, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTheme } from '../context/ThemeContext';

/*
MİMARİ GEREKÇE
Kart, kapatma perdesinin kardeşidir. Perde tam ekran ve alttadır. Kart
ondan sonra çizildiği için başlığa veya metne basmak pencereyi kapatmaz.
Uzun metin kartın içinde kayar.

PERFORMANS NOTU
Kaydırma yalnızca kartın içindedir. Alttaki kampüs listesi bu sırada
yeniden ölçülmez.

NASIL ÇALIŞIR?
Başlık solda, kapatma sağdadır. Gövde ScrollView içindedir. Kartın
yüksekliği pencere yüksekliğinin yaklaşık dörtte üçü ile sınırlıdır. Metin sığmazsa
kartın içi kayar.
*/
function ModalCard({ title, onClose, children, colors, scaleFont }) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.titleRow}>
        <Text
          accessibilityRole="header"
          style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(20) }]}
        >
          {title}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          onPress={onClose}
          hitSlop={8}
          style={styles.close}
        >
          <Ionicons name="close" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>
      <ScrollView style={styles.bodyScroll} contentContainerStyle={styles.body}>
        {children}
      </ScrollView>
    </View>
  );
}

/*
MİMARİ GEREKÇE
Webde React Native Modal, kaydırılan listenin içinde kalıp görünen
ekranın ortasına değil listenin akışına çizilebiliyor. Sabit katman,
pencereyi tarayıcı penceresinin üstüne koyar. iOS ve Android'de Modal
sistem penceresidir ve geri tuşunu da kapatmaya bağlar.

PERFORMANS NOTU
Web katmanı yalnızca visible true iken vardır. Native Modal her zaman
mount edilir, görünürlüğü prop ile değişir. İkisi de tek kart çizer.

NASIL ÇALIŞIR?
Ortak perde ve kart sheet olarak kurulur. Kapatma hedefi perdenin
kendisi değil, kartın altındaki tam ekran Pressable'dır. Webde sheet,
document.body içine portal edilir. Alt boşluk, kartı sekme çubuğunun
üstünde tutar. Diğer platformlarda transparent Modal kullanılır.
*/
export default function InfoModal({ visible, title, onClose, children }) {
  const { colors, scaleFont } = useTheme();

  const sheet = (
    <View style={[styles.backdrop, Platform.OS === 'web' ? styles.webBackdrop : null]}>
      <Pressable
        accessibilityLabel="Pencereyi kapat"
        onPress={onClose}
        style={styles.backdropHit}
      />
      <ModalCard title={title} onClose={onClose} colors={colors} scaleFont={scaleFont}>
        {children}
      </ModalCard>
    </View>
  );

  if (Platform.OS === 'web') {
    if (!visible || typeof document === 'undefined') {
      return null;
    }
    const { createPortal } = require('react-dom');
    return createPortal(<View style={webLayer}>{sheet}</View>, document.body);
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} accessibilityViewIsModal>
      {sheet}
    </Modal>
  );
}

const webLayer = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  zIndex: 1000,
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    padding: 16,
  },
  webBackdrop: {
    paddingBottom: 88,
  },
  backdropHit: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    maxHeight: Math.round(Dimensions.get('window').height * 0.72),
    overflow: 'hidden',
    zIndex: 1,
  },
  bodyScroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontWeight: '700',
  },
  close: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    gap: 10,
  },
});
