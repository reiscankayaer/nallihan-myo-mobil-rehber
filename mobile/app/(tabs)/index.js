/*
MİMARİ GEREKÇE
Üniversitemiz, uygulamanın açılış sekmesidir. Üstte kurumun adı, altında
kampüs şeridi, onun altında "X Nerede?" araması durur. Kısayollar ve
bölüm şeridi aramanın altındadır. Sonuç satırları, soru yazılınca kutunun
hemen altında, kısayolların üstünde belirir. Bunu CampusSearch'ün listesi
yapar. Bu dosya o listenin başını ve sonunu doldurur. Ayrıntı pencereleri
de burada açılır. Çünkü hangi kartın seçildiği bu ekranın durumudur.

PERFORMANS NOTU
Dikey kaydırıcı tektir. Şerit ve bölüm kartları onun başlık ve alt
bilgisindedir. İkinci bir dikey liste açılmaz. Modal, seçilen tek kaydı
tutar. Bütün programlar modalın içinde yeniden aranmaz.

NASIL ÇALIŞIR?
SafeAreaView çentiği bırakır, alt sekme çubuğuna pay bırakmaz. Arama
bileşeni kalan yüksekliği doldurur. Kısayol veya bölüm kartı state'e
yazılır. InfoModal o state doluyken görünür.
*/

import { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

import CampusSearch from '../../src/components/CampusSearch';
import CampusSlider from '../../src/components/CampusSlider';
import InfoModal from '../../src/components/InfoModal';
import { CAMPUS_SHORTCUTS, CAMPUS_SLIDES, CAMPUS_UNITS } from '../../src/data/campusData';
import { PROGRAMS } from '../../src/data/programsData';
import { useTheme } from '../../src/context/ThemeContext';

/*
MİMARİ GEREKÇE
Başlık, üniversitenin adını ve yüksekokulun adını birlikte taşır. Repoda
resmî logo dosyası yoktur. Expo'nun varsayılan ikonu üniversite arması
diye basılmaz. Yerine, tema renklerinden üretilen AÜ yazısı durur. Logo
dosyası gelince bu kutu Image olur. İsimler aynı yerde kalır.

PERFORMANS NOTU
Kutu düz View ve Text'tir. Ağdan görsel inmez, çözülmez.

NASIL ÇALIŞIR?
Sol kutu lacivert zemine altın AÜ yazar. Sağda iki satır kurum adı vardır.
Altındaki cümle, hesabın gerekmediğini söyler.
*/

function SchoolMark() {
  const { colors, scaleFont } = useTheme();

  return (
    <View accessibilityLabel="Ankara Üniversitesi Nallıhan Meslek Yüksekokulu">
      <View style={styles.brandRow}>
        <View style={[styles.mark, { backgroundColor: colors.primary, borderColor: colors.accent }]}>
          <Text style={[styles.markText, { color: colors.accent, fontSize: scaleFont(18) }]}>AÜ</Text>
        </View>
        <View style={styles.brandText}>
          <Text style={[styles.brandUniversity, { color: colors.textPrimary, fontSize: scaleFont(13) }]}>
            Ankara Üniversitesi
          </Text>
          <Text style={[styles.brandSchool, { color: colors.textPrimary, fontSize: scaleFont(18) }]}>
            Nallıhan Meslek Yüksekokulu
          </Text>
        </View>
      </View>
      <Text style={[styles.welcome, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
        Hesap açmadan kampüsü, bölümleri ve acil numaraları buradan okuyun.
      </Text>
    </View>
  );
}

/*
MİMARİ GEREKÇE
Üç kısayol, sık sorulan üç işi arama kutusuna yazdırmadan açar: yemek,
takvim, acil hat. Hepsi aynı modal kabını kullanır. Seçilen kaydın
kimliği state'te durur.

PERFORMANS NOTU
Üç düğme haritayla basılır. İkon paketi zaten yüklüdür. Yeni görsel inmez.

NASIL ÇALIŞIR?
Basılan kısayol setShortcut ile yazılır. Modal, CAMPUS_SHORTCUTS içinden
o kaydı ve varsa bağlı birimin katını gösterir. Numara satırı tel
bağlantısı açar.
*/

/*
MİMARİ GEREKÇE
Duyuru listesi bu sekmenin içinde ikinci bir dikey liste olmaz.
Kapı, kök yığındaki duyurular ekranını açar. Dört sekme aynı kalır.

PERFORMANS NOTU
Kapı bir Pressable'dır. Firestore dinleyicisi bu dosyada kurulmaz.
Dinleyici yalnızca duyurular ekranı açıkken yaşar.

NASIL ÇALIŞIR?
Basılınca router /duyurular adresine iter. Geri, bu sekmeye döner.
*/

function AnnouncementDoor() {
  const router = useRouter();
  const { colors, scaleFont } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Duyuruları aç"
      onPress={() => router.push('/duyurular')}
      style={[styles.door, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <Ionicons name="megaphone-outline" size={22} color={colors.accent} />
      <View style={styles.doorText}>
        <Text style={[styles.shortcutLabel, { color: colors.textPrimary, fontSize: scaleFont(16) }]}>
          Duyurular
        </Text>
        <Text style={[styles.programMeta, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
          Panelden gelen kayıtlar
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

function ShortcutRow({ onOpen }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View>
      <Text
        accessibilityRole="header"
        style={[styles.section, { color: colors.textPrimary, fontSize: scaleFont(22) }]}
      >
        Hızlı kısayollar
      </Text>
      <View style={styles.shortcutGrid}>
        {CAMPUS_SHORTCUTS.map((shortcut) => (
          <Pressable
            key={shortcut.id}
            accessibilityRole="button"
            accessibilityLabel={shortcut.title}
            onPress={() => onOpen(shortcut)}
            style={[styles.shortcut, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Ionicons name={shortcut.icon} size={22} color={colors.accent} />
            <Text style={[styles.shortcutLabel, { color: colors.textPrimary, fontSize: scaleFont(13) }]}>
              {shortcut.title}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

/*
MİMARİ GEREKÇE
Bölümler yatay şerittedir. Dört kart yan yana sığmaz. Dikey sayfayı dört
uzun kartla uzatmak, kat rehberini aşağı iter. Şerit, adayı kartın içine
alır. Ayrıntı modalda açılır.

PERFORMANS NOTU
Dört kart sanal liste istemez. Yatay ScrollView hepsini tutar. Dikey
FlatList ile aynı yönde ikinci bir liste olmadığı için kaydırma çakışmaz.

NASIL ÇALIŞIR?
Kart PROGRAMS dizisinden basılır. Basınca program nesnesi üst state'e
yazılır. Modal o nesnenin süre, kontenjan, laboratuvar ve istihdam
alanlarını okur. YÖK Atlas düğmesi yokAtlasUrl adresini açar.
*/

function ProgramRail({ onOpen }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View>
      <Text
        accessibilityRole="header"
        style={[styles.section, { color: colors.textPrimary, fontSize: scaleFont(22) }]}
      >
        Bölümlerimiz
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.programRow}
      >
        {PROGRAMS.map((program) => (
          <Pressable
            key={program.id}
            accessibilityRole="button"
            accessibilityLabel={`${program.name} ayrıntısını aç`}
            onPress={() => onOpen(program)}
            style={[styles.programCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Text style={[styles.programName, { color: colors.textPrimary, fontSize: scaleFont(16) }]}>
              {program.name}
            </Text>
            <Text style={[styles.programMeta, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
              {`${program.duration} · ${program.sourceYear} kontenjan ${program.quota}`}
            </Text>
            <Text style={[styles.programLink, { color: colors.accent, fontSize: scaleFont(13) }]}>
              Ayrıntı
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

export default function UniversitemizScreen() {
  const { colors, scaleFont } = useTheme();
  const [program, setProgram] = useState(null);
  const [shortcut, setShortcut] = useState(null);
  const linkedUnit = shortcut?.unitId
    ? CAMPUS_UNITS.find((unit) => unit.id === shortcut.unitId)
    : null;

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <CampusSearch
        header={
          <View style={styles.header}>
            <SchoolMark />
            <CampusSlider slides={CAMPUS_SLIDES} />
          </View>
        }
        footer={
          <View style={styles.footerBlocks}>
            <AnnouncementDoor />
            <ShortcutRow onOpen={setShortcut} />
            <ProgramRail onOpen={setProgram} />
          </View>
        }
      />

      <InfoModal visible={program !== null} title={program?.name ?? ''} onClose={() => setProgram(null)}>
        {program ? (
          <View style={styles.modalBody}>
            <Text style={[styles.modalLine, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
              {`${program.duration} · ÖSYM ${program.osymCode}`}
            </Text>
            <Text style={[styles.modalLine, { color: colors.textPrimary, fontSize: scaleFont(15) }]}>
              {`${program.sourceYear} genel kontenjan ${program.quota}, yerleşen ${program.placed}. Tercih döneminde ÖSYM kılavuzu esas alınır.`}
            </Text>
            <Text style={[styles.modalLabel, { color: colors.textPrimary, fontSize: scaleFont(15) }]}>
              Laboratuvar ve uygulama
            </Text>
            <Text style={[styles.modalLine, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
              {program.labs}
            </Text>
            <Text style={[styles.modalLabel, { color: colors.textPrimary, fontSize: scaleFont(15) }]}>
              Mezuniyet sonrası
            </Text>
            <Text style={[styles.modalLine, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
              {program.employment}
            </Text>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="YÖK Atlas sayfasını aç"
              onPress={() => Linking.openURL(program.yokAtlasUrl)}
              style={[styles.linkButton, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.linkLabel, { color: colors.onPrimary, fontSize: scaleFont(15) }]}>
                YÖK Atlas’ta aç
              </Text>
              <Ionicons name="open-outline" size={18} color={colors.onPrimary} />
            </Pressable>
          </View>
        ) : null}
      </InfoModal>

      <InfoModal
        visible={shortcut !== null}
        title={shortcut?.title ?? ''}
        onClose={() => setShortcut(null)}
      >
        {shortcut ? (
          <View style={styles.modalBody}>
            {shortcut.paragraphs.map((paragraph) => (
              <Text
                key={paragraph}
                style={[styles.modalLine, { color: colors.textSecondary, fontSize: scaleFont(15) }]}
              >
                {paragraph}
              </Text>
            ))}
            {linkedUnit ? (
              <Text style={[styles.modalLine, { color: colors.textPrimary, fontSize: scaleFont(15) }]}>
                {`${linkedUnit.name}: ${linkedUnit.floor}. ${linkedUnit.workingHours}.`}
              </Text>
            ) : null}
            {shortcut.numbers?.map((number) => (
              <Pressable
                key={number.id}
                accessibilityRole="link"
                accessibilityLabel={`${number.label} ${number.value} ara`}
                onPress={() => Linking.openURL(`tel:${number.tel}`)}
                style={[styles.numberRow, { borderColor: colors.border }]}
              >
                <Ionicons name="call" size={18} color={colors.accent} />
                <View style={styles.numberText}>
                  <Text style={[styles.modalLabel, { color: colors.textPrimary, fontSize: scaleFont(15) }]}>
                    {number.label}
                  </Text>
                  <Text style={[styles.modalLine, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
                    {number.value}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : null}
      </InfoModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  header: {
    gap: 12,
    marginBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    fontWeight: '800',
  },
  brandText: {
    flex: 1,
    gap: 2,
  },
  brandUniversity: {
    fontWeight: '600',
  },
  brandSchool: {
    fontWeight: '700',
  },
  welcome: {
    marginTop: 8,
    lineHeight: 22,
  },
  footerBlocks: {
    gap: 16,
  },
  door: {
    minHeight: 64,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  doorText: {
    flex: 1,
    gap: 2,
  },
  section: {
    fontWeight: '700',
    marginBottom: 8,
  },
  shortcutGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  shortcut: {
    flex: 1,
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    justifyContent: 'space-between',
    gap: 8,
  },
  shortcutLabel: {
    fontWeight: '700',
  },
  programRow: {
    gap: 12,
    paddingRight: 4,
  },
  programCard: {
    width: 240,
    minHeight: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    justifyContent: 'space-between',
    gap: 8,
  },
  programName: {
    fontWeight: '700',
  },
  programMeta: {
    lineHeight: 18,
  },
  programLink: {
    fontWeight: '700',
  },
  modalBody: {
    gap: 8,
  },
  modalLabel: {
    fontWeight: '700',
  },
  modalLine: {
    lineHeight: 22,
  },
  linkButton: {
    minHeight: 44,
    borderRadius: 8,
    marginTop: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  linkLabel: {
    fontWeight: '700',
  },
  numberRow: {
    minHeight: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  numberText: {
    flex: 1,
  },
});
