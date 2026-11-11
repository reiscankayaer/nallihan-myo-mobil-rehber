/*
MİMARİ AÇIKLAMA
Duyurular, dört sekmenin dışında bir yığın ekranıdır. Üniversitemiz
sekmesindeki kapı buraya iter. Geri, sekmeye döner. Liste Firestore
duyurular koleksiyonudur. Panelin yazdığı başlık, özet, tarih ve
link burada okunur. Ekranda sahte duyuru dizisi yoktur. yayinda
alanı false olan belge listeye girmez.

REAL-TIME VERİ YÖNETİMİ
onSnapshot ilk görüntüyü ve sonraki her değişikliği state'e yazar.
Panelden eklenen veya silinen kayıt, bu ekran açıkken yenilemeden
düşer. İlk görüntü gelene kadar ActivityIndicator durur. Dinleyici
ekran kalkınca bırakılır. Sıra, createdAtMs büyükten küçüğe client
tarafında kurulur. Ayrı bir dizin istenmez.
*/

import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { collection, onSnapshot } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';

import { db } from '../src/firebase';
import { useTheme } from '../src/context/ThemeContext';

function safeHttpUrl(value) {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '';
    return url.toString();
  } catch {
    return '';
  }
}

function announcementDate(item) {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  if (item.yayinTarihi?.toDate) {
    return item.yayinTarihi.toDate().toLocaleDateString('tr-TR', options);
  }
  if (typeof item.createdAtMs === 'number') {
    return new Date(item.createdAtMs).toLocaleDateString('tr-TR', options);
  }
  return '';
}

function sortKey(item) {
  if (typeof item.createdAtMs === 'number') return item.createdAtMs;
  if (item.yayinTarihi?.toMillis) return item.yayinTarihi.toMillis();
  return 0;
}

function AnnouncementCard({ item }) {
  const { colors, scaleFont } = useTheme();
  const date = announcementDate(item);
  const title = typeof item.baslik === 'string' && item.baslik.trim() ? item.baslik.trim() : 'Başlıksız duyuru';
  const summary = typeof item.ozet === 'string' && item.ozet.trim() ? item.ozet.trim() : '';
  const link = safeHttpUrl(item.link);

  const card = (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {date ? (
        <Text style={[styles.date, { color: colors.accent, fontSize: scaleFont(13) }]}>{date}</Text>
      ) : null}
      <Text style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(17) }]}>{title}</Text>
      {summary ? (
        <Text style={[styles.summary, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>{summary}</Text>
      ) : null}
    </View>
  );

  if (!link) return card;

  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${title} bağlantısını aç`}
      onPress={() => Linking.openURL(link)}
    >
      {card}
    </Pressable>
  );
}

export default function DuyurularScreen() {
  const router = useRouter();
  const { colors, scaleFont } = useTheme();
  const [items, setItems] = useState([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'duyurular'),
      (snapshot) => {
        const next = snapshot.docs
          .map((item) => ({ id: item.id, ...item.data() }))
          .filter((item) => item.yayinda !== false)
          .sort((a, b) => sortKey(b) - sortKey(a));
        setItems(next);
        setError('');
        setReady(true);
      },
      () => {
        setError('Duyurular okunamadı. Bağlantı veya Firestore kuralı engelliyor olabilir.');
        setReady(true);
      },
    );
    return unsubscribe;
  }, []);

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={styles.topBar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Geri"
          onPress={() => router.back()}
          style={styles.back}
        >
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </Pressable>
        <Text
          accessibilityRole="header"
          style={[styles.heading, { color: colors.textPrimary, fontSize: scaleFont(22) }]}
        >
          Duyurular
        </Text>
      </View>

      {!ready ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            error ? (
              <Text style={[styles.empty, { color: '#B91C1C', fontSize: scaleFont(15) }]}>{error}</Text>
            ) : null
          }
          ListEmptyComponent={
            error ? null : (
              <Text style={[styles.empty, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
                Henüz duyuru yok. Panelden eklenince burada görünür.
              </Text>
            )
          }
          renderItem={({ item }) => <AnnouncementCard item={item} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    minHeight: 52,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  back: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontWeight: '700',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    gap: 6,
  },
  date: {
    fontWeight: '700',
  },
  title: {
    fontWeight: '700',
  },
  summary: {
    lineHeight: 20,
  },
  empty: {
    lineHeight: 22,
    paddingTop: 24,
  },
});
