/*
MİMARİ AÇIKLAMA
Bu dosya öğrenci uygulamasının görünüm katmanıdır. Açık ve koyu palet,
yazı boyutu çarpanı ve bu iki tercihin cihaz hafızasındaki kaydı burada
yaşar. Ekranlar renk kodu tutmaz; useTheme() ile o anki paleti ve
scaleFont yardımcı fonksiyonunu okur. Böylece sekme çubuğu, kart ve
gövde metni aynı karardan beslenir. Tercih bir hesap değildir. Rehber
girişsiz olduğu için kayıt Firestore'a değil, telefonun kendi deposuna
yazılır. Uygulama kapanıp açılınca aynı seçim geri gelir.

NEDEN KULLANILDI?
React Context, tema gibi seyrek değişen ve bütün ağaca okunan durum için
Expo'nun önerdiği sade yoldur. Ayrı bir durum kütüphanesi bu iş için
gereksiz bir bağımlılık olurdu. Kalıcılık @react-native-async-storage/async-storage
ile kurulur. Expo SDK 58 bu paketi şifresiz, kalıcı anahtar-değer deposu
olarak belgeler. Tema bir sır değildir; şifreli kasaya gerek yoktur.
Kaynak: https://docs.expo.dev/versions/v58.0.0/sdk/async-storage/
*/

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@nallihan-myo/gorunum';

export const FONT_SIZE_LEVELS = {
  small: 0.9,
  normal: 1.0,
  large: 1.15,
};

const PALETTES = {
  light: {
    primary: '#12234A',
    accent: '#C0A058',
    background: '#F8FAFC',
    card: '#FFFFFF',
    textPrimary: '#12234A',
    textSecondary: '#475569',
    border: '#E2E8F0',
    tabBar: '#12234A',
    tabActive: '#C0A058',
    tabInactive: '#94A3B8',
    onPrimary: '#F8FAFC',
  },
  dark: {
    primary: '#1B2A4E',
    accent: '#C0A058',
    background: '#0F172A',
    card: '#1E293B',
    textPrimary: '#F8FAFC',
    textSecondary: '#CBD5E1',
    border: '#334155',
    tabBar: '#1B2A4E',
    tabActive: '#C0A058',
    tabInactive: '#94A3B8',
    onPrimary: '#F8FAFC',
  },
};

const ThemeContext = createContext(null);

function isMode(value) {
  return value === 'light' || value === 'dark';
}

function isFontLevel(value) {
  return Object.prototype.hasOwnProperty.call(FONT_SIZE_LEVELS, value);
}

/*
MİMARİ AÇIKLAMA
ThemeProvider ağacın kökünde bir kez durur. İlk karede kayıtlı tercihi
okumadan ekranı boyamaz. Aksi halde koyu mod seçmiş kullanıcıda bir an
açık palet görünüp sonra düzelir. Okuma bitmeden yapılan yazma da tehlikelidir:
varsayılan açık mod, diskteki koyu modun üstüne yazılır. ready bayrağı bu
yarışı kapatır. Bozuk veya tanınmayan bir kayıt yok sayılır, fabrika ayarı
açık mod ve normal yazı olarak kalır.

NEDEN KULLANILDI?
AsyncStorage.getItem Promise döndürür. useEffect bu işi çizimden sonraya
bırakır ve bileşen sökülürse cancelled ile güncellemeyi keser. setItem
yalnızca ready olduktan sonra çalışır. Hata yutulmaz, uygulamayı da düşürmez:
depo dolu veya web'de gizli modda olsa bile rehber son bilinen paletle açılır.
*/

export function ThemeProvider({ children }) {
  const [mode, setModeState] = useState('light');
  const [fontSizeLevel, setFontSizeLevelState] = useState('normal');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (cancelled || !raw) {
          return;
        }
        const saved = JSON.parse(raw);
        if (isMode(saved.mode)) {
          setModeState(saved.mode);
        }
        if (isFontLevel(saved.fontSizeLevel)) {
          setFontSizeLevelState(saved.fontSizeLevel);
        }
      } catch {
        // Kayıt okunamazsa fabrika ayarı yeterlidir. Rehber bu yüzden durmaz.
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    hydrate();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const payload = JSON.stringify({ mode, fontSizeLevel });
    AsyncStorage.setItem(STORAGE_KEY, payload).catch(() => {
      // Yazılamayan tercih bir sonraki açılışta eski haline döner. Ekran yine çalışır.
    });
  }, [ready, mode, fontSizeLevel]);

  const value = useMemo(() => {
    const fontScale = FONT_SIZE_LEVELS[fontSizeLevel];

    return {
      ready,
      mode,
      fontSizeLevel,
      fontScale,
      colors: PALETTES[mode],
      setMode(next) {
        if (isMode(next)) {
          setModeState(next);
        }
      },
      setFontSizeLevel(next) {
        if (isFontLevel(next)) {
          setFontSizeLevelState(next);
        }
      },
      toggleMode() {
        setModeState((current) => (current === 'dark' ? 'light' : 'dark'));
      },
      scaleFont(size) {
        return Math.round(size * fontScale);
      },
    };
  }, [ready, mode, fontSizeLevel]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/*
MİMARİ AÇIKLAMA
useTheme, sağlayıcının dışına yanlışlıkla konmuş bir bileşenin sessizce
boş renklerle çizilmesini engeller. Hata, jüri demosunda yanlış ekranı
hemen gösterir.

NEDEN KULLANILDI?
Context tüketicisini kancaya sarmak, ekranların createContext ayrıntısını
bilmemesi içindir. Her sekme aynı kancayı çağırır.
*/

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error('useTheme yalnızca ThemeProvider içinde çağrılır.');
  }
  return value;
}
