/*
MİMARİ GEREKÇE
"X Nerede?" kutusu kat rehberinin kapısıdır. Öğrenci birim adını, katı
veya kısa adı yazar. Sonuç, kat rozetiyle aynı satırda durur. Boş kutu
bütün binayı dökmez. Arama başlayınca liste, kutunun hemen altında açılır.
Sayfanın geri kalanı bu listenin altbilgisidir. Dikey kaydırma tektir.
Arama listesi ile sayfa kaydırması birbirine girmez.

PERFORMANS NOTU
Türkçe sadeleştirme her tuşta bütün cümleler için yeniden yapılmaz.
Birimlerin arama anahtarı modül yüklenirken bir kez üretilir. Tuş vuruşu
yalnızca bu hazır dizgide alt dizgi arar. On iki kayıtta sanal pencere
kısa sürer. FlatList yine de kullanılır. Derslik sayısı artınca aynı
bileşen pencereler. removeClippedSubviews yalnız Android'de açıktır.
Orada ekran dışı satır yerinden sökülür.

NASIL ÇALIŞIR?
normalizeTurkish harfi katlar. filterCampusUnits boş sorguda boş dizi
döner, dolu sorguda anahtarı kapsayan birimleri bırakır. FlatList bu
diziyi basar. X düğmesi sorguyu siler, liste kapanır.
*/

import { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { CAMPUS_UNITS } from '../data/campusData';
import { useTheme } from '../context/ThemeContext';

const CATEGORY_LABEL = {
  idari: 'İdari',
  derslik: 'Derslik',
  lab: 'Laboratuvar',
  sosyal: 'Sosyal',
};

/*
MİMARİ GEREKÇE
Türkçe aramada iki ayrı sorun vardır. Birincisi İ/i ve I/ı ayrımıdır.
İkincisi öğrencinin ç yerine c, ğ yerine g yazmasıdır. İkisi de katlanır.
Böylece "ogrenci", "Öğrenci" ve "OGRENCI" aynı kapıya çıkar.

PERFORMANS NOTU
Fonksiyon kısadır ve safdır. Ağ, bellek veya çizim yapmaz. Pahalı olan
metin birleştirme, bu fonksiyonun dışında, modül yüklenirken bir kez
yapılır. Tuş başına yalnızca sorgu dizgisi katlanır.

NASIL ÇALIŞIR?
Önce büyük İ, noktası korunarak i yapılır. Sonra tr-TR küçük harfe çevrilir.
Bu adımda büyük I, ı olur. Ardından ı ve i tek i'de birleşir. ç, ğ, ö, ş, ü
noktasız karşılığına iner. Sonuç, karşılaştırmada kullanılan düz dizgidir.
*/

export function normalizeTurkish(value) {
  return String(value ?? '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

/*
MİMARİ GEREKÇE
Arama anahtarı, öğrencinin yazabileceği bütün yüzeyleri tek satırda toplar:
ad, tür, kat, tarif, saat ve bilerek eklenen kısa adlar. Ekran bu satırı
göstermez. Yalnızca süzgeç okur.

PERFORMANS NOTU
join ve normalizeTurkish, birim sayısı kadar ve bir kez çalışır. Dizi
SEARCH_DOCUMENTS sabitidir. Render bunu yeniden kurmaz.

NASIL ÇALIŞIR?
listCampusUnits çıktısındaki her birime searchKey eklenir. Anahtar,
alanların normalizeTurkish ile katlanmış birleşimidir.
*/

const SEARCH_DOCUMENTS = CAMPUS_UNITS.map((unit) => ({
  ...unit,
  searchKey: normalizeTurkish(
    [unit.name, unit.category, unit.floor, unit.description, unit.workingHours, unit.keywords.join(' ')].join(
      ' ',
    ),
  ),
}));

/*
MİMARİ GEREKÇE
Boş kutu, "henüz sormadın" demektir. Bütün katları boşken listelemek,
arama kutusunu bir dizin sayfasına çevirir. Bu ekranın işi soruya yanıt
vermektir.

PERFORMANS NOTU
includes, hazır anahtar üzerinde doğrusal tarar. On iki kayıtta maliyet
bir tuşun altına sığar. Erken dönüş, boş sorguda döngüyü hiç açmaz.

NASIL ÇALIŞIR?
Sorgu da aynı katlamadan geçer. Boşsa dizi boş döner. Doluysa anahtarı
sorguyu içeren belgeler, kaynak sırasıyla bırakılır.
*/

export function filterCampusUnits(rawQuery) {
  const query = normalizeTurkish(rawQuery);
  if (!query) {
    return [];
  }
  return SEARCH_DOCUMENTS.filter((unit) => unit.searchKey.includes(query));
}

/*
MİMARİ GEREKÇE
Satır, bulunan birimin kimliği ve katıdır. Kat rozeti metnin yanında durur.
Renk tek başına kat söylemez. Rozetin içinde "Zemin Kat" yazar.

PERFORMANS NOTU
Satır sadedir. Gölge ve iç içe liste yoktur. FlatList aynı türden satırı
yeniden kullanır.

NASIL ÇALIŞIR?
Rozet floor alanını, alt satır category etiketini ve saati basar. Açıklama
iki satırla sınırlanır. Uzun tarif kaydırılan sayfanın içinde kalır.
*/

function UnitRow({ unit }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View
      accessibilityLabel={`${unit.name}, ${unit.floor}, ${CATEGORY_LABEL[unit.category]}`}
      style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={styles.rowTop}>
        <Text style={[styles.rowTitle, { color: colors.textPrimary, fontSize: scaleFont(16) }]}>
          {unit.name}
        </Text>
        <View style={[styles.badge, { backgroundColor: colors.accent }]}>
          <Text style={[styles.badgeText, { color: colors.primary, fontSize: scaleFont(12) }]}>
            {unit.floor}
          </Text>
        </View>
      </View>
      <Text style={[styles.meta, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
        {`${CATEGORY_LABEL[unit.category]} · ${unit.workingHours}`}
      </Text>
      <Text
        numberOfLines={2}
        style={[styles.description, { color: colors.textSecondary, fontSize: scaleFont(14) }]}
      >
        {unit.description}
      </Text>
    </View>
  );
}

export default function CampusSearch({ header, footer }) {
  const { colors, scaleFont } = useTheme();
  const [query, setQuery] = useState('');
  const results = useMemo(() => filterCampusUnits(query), [query]);

  return (
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={results}
      keyExtractor={(unit) => unit.id}
      renderItem={({ item }) => <UnitRow unit={item} />}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      initialNumToRender={8}
      windowSize={5}
      removeClippedSubviews={Platform.OS === 'android'}
      ListHeaderComponent={
        <View>
          {header}
          <Text
            accessibilityRole="header"
            style={[styles.section, { color: colors.textPrimary, fontSize: scaleFont(22) }]}
          >
            X Nerede?
          </Text>
          <Text style={[styles.sectionLead, { color: colors.textSecondary, fontSize: scaleFont(14) }]}>
            Kampüs kat rehberi
          </Text>
          <View style={[styles.field, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name="search" size={20} color={colors.accent} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Öğrenci işleri, lab, kantin nerede?"
              placeholderTextColor={colors.textSecondary}
              accessibilityLabel="Kampüste birim ara"
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              style={[
                styles.input,
                { color: colors.textPrimary, fontSize: scaleFont(16) },
                Platform.OS === 'web' ? { outlineStyle: 'none' } : null,
              ]}
            />
            {query.length > 0 ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Aramayı temizle"
                onPress={() => setQuery('')}
                hitSlop={8}
                style={styles.clear}
              >
                <Ionicons name="close" size={20} color={colors.textPrimary} />
              </Pressable>
            ) : null}
          </View>
          {query.length > 0 ? (
            <Text style={[styles.count, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
              {results.length === 0
                ? 'Bu aramayla eşleşen birim yok.'
                : `${results.length} birim bulundu.`}
            </Text>
          ) : (
            <Text style={[styles.count, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
              Birim adı, kat veya kısa ad yazın.
            </Text>
          )}
        </View>
      }
      ListFooterComponent={<View style={styles.footer}>{footer}</View>}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  section: {
    fontWeight: '700',
    marginTop: 8,
  },
  sectionLead: {
    marginBottom: 8,
  },
  field: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    minHeight: 44,
    paddingVertical: 8,
  },
  clear: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    marginTop: 8,
    marginBottom: 4,
  },
  separator: {
    height: 8,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  rowTitle: {
    flex: 1,
    fontWeight: '700',
  },
  badge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    fontWeight: '700',
  },
  meta: {
    lineHeight: 18,
  },
  description: {
    lineHeight: 20,
  },
  footer: {
    gap: 12,
    marginTop: 16,
  },
});
