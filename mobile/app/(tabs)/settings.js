/*
MİMARİ AÇIKLAMA
Ayarlar, rehberin son sekmesidir ve iOS Ayarlar uygulamasındaki gibi
gruplu kutulardan oluşur. Her kutu bir konudur: görünüm, bildirim,
hızlı işlem, kurum. Karanlık mod ve yazı boyutu ThemeContext'ten gelir.
Bu iki seçim değişince bütün sekmeler aynı anda yeniden çizilir. Bildirim
anahtarları bu dosyanın kendi state'idir. Henüz bir konu aboneliği yoktur.
Dosya adı settings.js, sekmedeki name="settings" ile birebir eşleşir.

ERİŞİLEBİLİRLİK VE HAFIZA
Karanlık mod ve yazı düzeyi ThemeContext içinde AsyncStorage'a yazılır.
Anahtar @nallihan-myo/gorunum'dur. Uygulama kapanıp açılınca aynı seçim
geri gelir. Yazı düğmeleri 0,9, 1 ve 1,15 çarpanlarını buraya ikinci kez
yazmaz. Tablo ThemeContext'teki FONT_SIZE_LEVELS'tır. Her anahtar ve
satır en az 44 nokta yüksekliğindedir. Seçili yazı düğmesi altın zemin
ve lacivert yazı kullanır. Koyu kartın üstünde kaybolmaz.

HUKUKİ UYUM
Rehber hesap açmaz. Ad, numara ve konum bu sekmede toplanmaz. Bildirim
anahtarları kapalı başlar. Önceden işaretli izin, geçerli bir rıza değildir.
Bu sürümde o anahtarlar ekranda kalır ve bir sunucuya gitmez. Firebase
bağlanınca izin yeniden sorulacaktır. Gizlilik penceresi, üniversitenin
kurumsal aydınlatma metninin yerine geçmez. Uygulamanın bu sürümünün
kısa notudur. Paylaşım metnindeki adres mağaza linki değildir. Uygulama
henüz mağazada yoktur. Bağlantı, yüksekokulun yayımlanmış sitesidir.
*/

import { useState } from 'react';
import { Alert, Linking, Platform, Pressable, Share, StyleSheet, Switch, Text, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import ScreenFrame from '../../src/components/ScreenFrame';
import InfoModal from '../../src/components/InfoModal';
import { FONT_SIZE_LEVELS, useTheme } from '../../src/context/ThemeContext';

const LEVEL_LABEL = {
  small: 'Küçük',
  normal: 'Normal',
  large: 'Büyük',
};

const SHARE_URL = 'https://nallihanmyo.ankara.edu.tr/';
const SHARE_MESSAGE = `Nallıhan MYO Mobil Rehber'i hemen indir: ${SHARE_URL}`;
const SCHOOL_MAIL = 'nmyo@ankara.edu.tr';

const NOTICE_ROWS = [
  { id: 'duyurular', label: 'Duyurular' },
  { id: 'etkinlikler', label: 'Etkinlikler' },
  { id: 'yemekhane', label: 'Yemekhane menüsü' },
];

/*
MİMARİ AÇIKLAMA
Grup, bir başlık ve onun altındaki tek kutudur. Satırlar kutunun içinde
ayraçla ayrılır. Böylece her panel aynı kabı kullanır ve ekran dört ayrı
liste bileşeni kurmaz.

ERİŞİLEBİLİRLİK VE HAFIZA
Başlık, kutunun üstünde ve ikincil renktedir. Kutu zemini kart rengidir.
Karanlık modda başlık açık gri, kutu lacivert arduvaz kalır. Grup tercih
yazmaz. Yazan, satırın kendi olayıdır.

HUKUKİ UYUM
Grup bir form değildir. Gönder düğmesi yoktur. Öğrenci bir satıra basınca
yalnızca o satırın işi çalışır.
*/
function SettingsGroup({ title, children }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View style={styles.group}>
      <Text style={[styles.groupTitle, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
        {title}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

/*
MİMARİ AÇIKLAMA
Anahtar satırı, solda ad ve sağda Switch taşır. Bildirim satırları ile
karanlık mod aynı satırı kullanır. Fark, value ve onValueChange
bağındadır. Satır, anahtarın anlamını bilmez.

ERİŞİLEBİLİRLİK VE HAFIZA
Switch erişilebilirlik etiketi satırın adıdır. İz açıkken checked
durumu okunur. Palet rengi altın iz, gri kapalı izdir. Başparmak rengi
web'de tarayıcıya kalır. İz rengi her iki modda da görünür.

HUKUKİ UYUM
Bu bileşen rızayı kaydetmez. Karanlık mod ThemeContext'e gider. Bildirim
anahtarı çağıranın verdiği state'te kalır. İkisi de bir sunucuya yazılmaz.
*/
function SwitchRow({ label, detail, value, onValueChange, last }) {
  const { colors, scaleFont } = useTheme();

  return (
    <View
      style={[
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: scaleFont(16) }]}>
          {label}
        </Text>
        {detail ? (
          <Text style={[styles.rowDetail, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
            {detail}
          </Text>
        ) : null}
      </View>
      <Switch
        accessibilityLabel={label}
        accessibilityState={{ checked: value }}
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#94A3B8', true: colors.accent }}
        thumbColor={colors.onPrimary}
        ios_backgroundColor="#94A3B8"
      />
    </View>
  );
}

/*
MİMARİ AÇIKLAMA
Eylem satırı bir sayfa açmaz. Basılınca verilen fonksiyonu çağırır.
Sağdaki ok, satırın bir iş yaptığını gösterir. Ayarlar sekmesi içinde
ayrı bir yığın gezgini kurulmaz.

ERİŞİLEBİLİRLİK VE HAFIZA
Satır bir düğmedir. Yüksekliği 44 noktanın altına inmez. Ok süs değildir.
Ekran okuyucu satırın adını düğme olarak okur.

HUKUKİ UYUM
Satır kendiliğinden posta, paylaşım veya pencere açmaz. İş, çağıranın
verdiği fonksiyondadır. Böylece gizlilik satırı ile posta satırı karışmaz.
*/
function ActionRow({ label, onPress, last }) {
  const { colors, scaleFont } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={[
        styles.row,
        !last && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
      ]}
    >
      <Text style={[styles.rowLabel, styles.rowGrow, { color: colors.textPrimary, fontSize: scaleFont(16) }]}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
    </Pressable>
  );
}

/*
MİMARİ AÇIKLAMA
Tanıtım turu bu sürümde bir ekran değildir. Düğme, sonraki sürüme
bırakıldığını söyler. Olmayan bir rotaya yönlendirme yapılmaz. Web'de
sistem uyarısı boş bir fonksiyondur. Cümle bu yüzden ekrana da yazılır.
Telefonda Alert açılır.

ERİŞİLEBİLİRLİK VE HAFIZA
Tur izlenmiş diye bir bayrak yazılmaz. Öğrenci düğmeye her basışta aynı
cümleyi görür. Cihaz hafızasında tur kaydı yoktur.

HUKUKİ UYUM
Tur, izin toplama ekranı değildir. Konum, kamera ve bildirim istenmez.
*/
function showTour(setNotice) {
  const message = 'Tanıtım turu bu sürümde yok. İlk açılış turu sonraki sürüme bırakıldı.';
  if (Platform.OS === 'web') {
    setNotice(message);
    return;
  }
  Alert.alert('Tanıtım turu', message);
}

/*
MİMARİ AÇIKLAMA
Paylaşım, işletim sisteminin paylaşım kağıdını açar. Metin sabittir.
Uygulama kendi paylaşım penceresini çizmez. Kağıt bu tarayıcıda yoksa
aynı cümle ekrana yazılır. Öğrenci metni yine görür.

ERİŞİLEBİLİRLİK VE HAFIZA
Paylaşım bir tercih değildir. AsyncStorage'a yazılmaz. İptal, hata diye
ekrana basılmaz. Yalnızca kağıdın hiç olmadığı durum not düşer.

HUKUKİ UYUM
Metin, mağazada olmayan bir indirme linki uydurmaz. Adres, yüksekokulun
yayımlanmış sitesidir. https://nallihanmyo.ankara.edu.tr/ Mağaza kaydı
açılınca yalnızca SHARE_URL değişir.
*/
async function shareApp(setNotice) {
  try {
    await Share.share({ message: SHARE_MESSAGE, url: SHARE_URL });
  } catch (error) {
    if (String(error?.message || '').includes('not supported')) {
      setNotice(SHARE_MESSAGE);
    }
  }
}

/*
MİMARİ AÇIKLAMA
Posta satırı, cihazın posta uygulamasında taslak açar. Alıcı, yüksekokulun
sitede yazan adresidir. Konu satırı rehberin adını taşır. Gövde boştur.
Öğrenci kendi cümlesini yazar.

ERİŞİLEBİLİRLİK VE HAFIZA
Bu çağrı rehbere metin yazdırmaz. Taslak, posta uygulamasının hafızasındadır.
Gönderilmezse rehberde bir kayıt oluşmaz.

HUKUKİ UYUM
Adres nmyo@ankara.edu.tr olarak yüksekokul sayfasında yayımlanmıştır.
Başka bir kişisel posta uydurulmaz. Uygulama iletinin kopyasını tutmaz.
*/
function mailSchool() {
  const subject = encodeURIComponent('Nallıhan MYO Mobil Rehber geri bildirim');
  Linking.openURL(`mailto:${SCHOOL_MAIL}?subject=${subject}`);
}

export default function AyarlarScreen() {
  const { colors, mode, fontSizeLevel, setFontSizeLevel, toggleMode, scaleFont } = useTheme();
  const dark = mode === 'dark';
  const [notices, setNotices] = useState({
    duyurular: false,
    etkinlikler: false,
    yemekhane: false,
  });
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [notice, setNotice] = useState('');

  return (
    <ScreenFrame>
      <Text
        accessibilityRole="header"
        style={[styles.title, { color: colors.textPrimary, fontSize: scaleFont(28) }]}
      >
        Ayarlar
      </Text>

      <SettingsGroup title="Görünüm">
        <SwitchRow
          label="Karanlık mod"
          detail={dark ? 'Koyu palet seçili. Bu cihazda saklanır.' : 'Açık palet seçili. Bu cihazda saklanır.'}
          value={dark}
          onValueChange={toggleMode}
        />
        <View style={styles.fontBlock}>
          <Text style={[styles.rowLabel, { color: colors.textPrimary, fontSize: scaleFont(16) }]}>
            Yazı boyutu
          </Text>
          <Text style={[styles.rowDetail, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
            Küçük 0,9 kat, normal 1 kat, büyük 1,15 kattır. Seçim bütün sekmelerde geçerlidir.
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
      </SettingsGroup>

      <SettingsGroup title="Bildirimler">
        {NOTICE_ROWS.map((row, index) => (
          <SwitchRow
            key={row.id}
            label={row.label}
            value={notices[row.id]}
            last={index === NOTICE_ROWS.length - 1}
            onValueChange={(next) => {
              setNotices((current) => ({ ...current, [row.id]: next }));
            }}
          />
        ))}
        <Text style={[styles.footnote, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
          Bu sürümde seçim yalnızca ekrandadır. Sunucuya gitmez. Bildirim izni, Firebase bağlanınca yeniden sorulur.
        </Text>
      </SettingsGroup>

      <SettingsGroup title="Hızlı işlemler">
        <ActionRow label="Tanıtım turunu tekrar göster" onPress={() => showTour(setNotice)} />
        <ActionRow label="Uygulamayı arkadaşınla paylaş" onPress={() => shareApp(setNotice)} last />
      </SettingsGroup>

      {notice ? (
        <Text style={[styles.notice, { color: colors.textPrimary, fontSize: scaleFont(14) }]}>{notice}</Text>
      ) : null}

      <SettingsGroup title="Kurumsal">
        <ActionRow label="Gizlilik Politikası ve KVKK" onPress={() => setPrivacyOpen(true)} />
        <ActionRow label="Okul iletişim ve geri bildirim" onPress={mailSchool} last />
      </SettingsGroup>

      <View style={styles.signature}>
        <Text style={[styles.signatureText, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
          Geliştirici: Reiscan Kayaer (ReisCode.dev) - Bilgisayar Programcılığı / Proje Ekibi
        </Text>
        <Text style={[styles.signatureText, { color: colors.textSecondary, fontSize: scaleFont(13) }]}>
          Sürüm: v1.0.0 (MVP)
        </Text>
      </View>

      <InfoModal
        visible={privacyOpen}
        title="Gizlilik ve KVKK"
        onClose={() => setPrivacyOpen(false)}
      >
        <Text style={[styles.modalText, { color: colors.textPrimary, fontSize: scaleFont(15) }]}>
          Bu rehber hesap açmaz. Ad, telefon ve konum bu sürümde toplanmaz.
        </Text>
        <Text style={[styles.modalText, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
          Karanlık mod ve yazı boyutu yalnızca bu cihazda saklanır. Bildirim anahtarları ekranda kalır ve bir sunucuya gitmez.
        </Text>
        <Text style={[styles.modalText, { color: colors.textSecondary, fontSize: scaleFont(15) }]}>
          Firebase bağlanınca bildirim isteği ayrıca sorulur. Kapalı anahtar izin sayılmaz. Bu pencere, üniversitenin kurumsal aydınlatma metninin yerine geçmez.
        </Text>
      </InfoModal>
    </ScreenFrame>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '700',
  },
  group: {
    gap: 8,
  },
  groupTitle: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginLeft: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    minHeight: 52,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  rowGrow: {
    flex: 1,
  },
  rowLabel: {
    fontWeight: '600',
  },
  rowDetail: {
    lineHeight: 18,
  },
  fontBlock: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  levels: {
    flexDirection: 'row',
    gap: 8,
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
  footnote: {
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  notice: {
    lineHeight: 20,
    fontWeight: '600',
  },
  signature: {
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  signatureText: {
    textAlign: 'center',
    lineHeight: 18,
  },
  modalText: {
    lineHeight: 22,
  },
});
