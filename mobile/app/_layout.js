/*
MİMARİ AÇIKLAMA
Bu dosya uygulamanın giriş düzenidir. expo-router/entry bu dosyayı ilk
ekran olarak açar. Eski App.js ve index.js görevini burası devralır:
sağlayıcılar, durum çubuğu ve kök gezgin burada kurulur. Kök gezgin bir
yığındır. Şimdilik yığında tek grup vardır, (tabs). İleride kat rehberi
veya duyuru ayrıntısı gibi bir ekran, sekmenin üstüne itilen yeni bir
Stack.Screen olarak bu dosyaya eklenir. Sekmeler o zaman yerinde kalır,
geri tuşu ayrıntıdan sekmeye döner.

NEDEN KULLANILDI?
Expo Router dosya tabanlı gezgini önerir. Dizin adı rotadır, _layout
o dizindeki sayfaların nasıl dizileceğini söyler. Stack, React Navigation
yığınının Expo Router karşılığıdır ve ayrı bir gezgin paketi gerektirmez.
Kaynak: https://docs.expo.dev/router/installation/
Kaynak: https://docs.expo.dev/router/basics/navigation-layouts/
*/

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider, useTheme } from '../src/context/ThemeContext';

/*
MİMARİ AÇIKLAMA
RootLayout yalnızca ThemeProvider'ı kurar. Asıl ağaç ThemedShell içindedir
çünkü durum çubuğu ve yığın, paleti okuyabilmek için sağlayıcının altında
olmak zorundadır. Kayıt diske inene kadar kabuk çizilmez. Böylece koyu
mod, ilk karede açık paletin üstüne binmez.

NEDEN KULLANILDI?
expo-status-bar, durum çubuğu yazısının rengini bildirim olarak değiştirir.
style="auto" işletim sisteminin görünümünü izler. Bu uygulamada görünüm,
ayarlardan seçilip cihaza yazılan tercihtir. İkisi ayrışmasın diye koyu
modda açık yazı (light), açık modda koyu yazı (dark) verilir. animated,
belgelenmiş geçiş bayrağıdır.
Kaynak: https://docs.expo.dev/versions/v58.0.0/sdk/status-bar/
*/

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ThemedShell />
    </ThemeProvider>
  );
}

/*
MİMARİ AÇIKLAMA
ThemedShell, kayıt okunduktan sonra yığını çizer. SafeAreaProvider bu
kabuğun içinde, yalnızca iOS ve Android'de durur. Web'de Expo Router'ın
kendi sağlayıcısı yeterlidir. İkinci sağlayıcı, SDK 58'de akan sayfanın
hidrasyonunu keser. initialWindowMetrics, çentik ölçüsünü ilk karede
hazır verir. Ölçü gelene kadar sıfır pay ile başlayıp içeriğin zıplaması
bu yüzden olmaz.

NEDEN KULLANILDI?
react-native-safe-area-context, Expo'nun güvenli alan kütüphanesidir.
Belge, Expo Router kullanırken sağlayıcının normalde ayrıca eklenmediğini
söyler. Yerel cihazlarda ilk kare ölçüsünü sabitlemek için belgedeki
initialMetrics örneği burada uygulanır. Web bu örneğin dışındadır.
Kaynak: https://docs.expo.dev/versions/v58.0.0/sdk/safe-area-context/
Kaynak: https://docs.expo.dev/develop/user-interface/safe-areas/
*/

function ThemedShell() {
  const { ready, mode, colors } = useTheme();

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  const navigation = (
    <>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} animated />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="duyurular" options={{ headerShown: false }} />
      </Stack>
    </>
  );

  if (Platform.OS === 'web') {
    return navigation;
  }

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      {navigation}
    </SafeAreaProvider>
  );
}
