/*
MİMARİ AÇIKLAMA
(tabs) bir rota grubudur. Parantez, adres çubuğunda görünmez; grup yalnızca
bu dört sayfayı aynı alt menüde toplar. Menüde tam dört sekme vardır:
Üniversitemiz, Yurtlarımız, Şehrimiz, Ayarlar. Sıra, Tabs.Screen bildirim
sırasıdır. index varsayılan açılış sekmesidir. İleride eklenecek bir
ayrıntı ekranı bu dosyaya beşinci sekme olarak konmaz. O ekran kök
yığına eklenir. Böylece alt menü ürün kararı olarak dört başlıkta kalır.

NEDEN KULLANILDI?
JavaScript sekmeleri Expo Router'ın Tabs bileşenidir ve React Navigation
alt sekmesinin üzerine kuruludur. SDK 56'dan beri bu gezgin Expo Router
ile birlikte gelir, ayrı paket istenmez. NativeTabs yerine Tabs seçildi
çünkü aktif ve pasif renk ile Ionicons, jüride satır satır gösterilecek
ortak bir API'dir. Native sekme platforma göre ikon ve renk modelini
değiştirir.
Kaynak: https://docs.expo.dev/router/advanced/tabs/
*/

import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

import { useTheme } from '../../src/context/ThemeContext';

const TABS = [
  {
    name: 'index',
    title: 'Üniversitemiz',
    icon: 'school',
  },
  {
    name: 'dorms',
    title: 'Yurtlarımız',
    icon: 'bed',
  },
  {
    name: 'city',
    title: 'Şehrimiz',
    icon: 'map',
  },
  {
    name: 'settings',
    title: 'Ayarlar',
    icon: 'settings',
  },
];

/*
MİMARİ AÇIKLAMA
Sekme çubuğunun zemini laciverttir. Aktif renk altın, pasif renk gri
olarak sabittir. Bu iki renk beyaz kartın üstünde yazı kontrastını
sağlamaz. Lacivert zemin, altının ve grinin okunmasını sağlar. Çubuğun
yüksekliği elle verilmez. Expo Router'ın alt sekme çubuğu, home indicator
ve Android gezinti çubuğu payını paddingBottom olarak kendisi ekler.
İkinci bir alt boşluk, çubuğu gereksiz yere uzatır.

NEDEN KULLANILDI?
tabBarActiveTintColor ve tabBarInactiveTintColor, sekme ikonu ile yazısını
tek değerden boyar. İkon @expo/vector-icons içindeki Ionicons kümesindendir.
Paket projede zaten vardır. Odaklanan sekme dolu ikon, diğerleri çizgi
ikon alır. Böylece seçili duran sekme yalnız renkle değil, biçimde de
ayrılır.
Kaynak: https://docs.expo.dev/router/advanced/tabs/
*/

export default function TabLayout() {
  const { colors, ready } = useTheme();

  if (!ready) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.accent,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarAccessibilityLabel: tab.title,
            tabBarIcon: ({ color, focused, size }) => (
              <Ionicons
                name={focused ? tab.icon : `${tab.icon}-outline`}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
