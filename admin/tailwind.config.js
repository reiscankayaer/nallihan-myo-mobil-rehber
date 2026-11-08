/*
Renkler theme.extend içindedir. theme.colors yazılırsa slate ve beyaz
silinir. Panelin geri kalanı o palete bağlıdır. primary lacivert,
secondary altındır. Tailwind 4 bu dosyayı kendiliğinden okumaz.
src/index.css içindeki @config satırı bağlar.
*/
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#12234A',
        secondary: '#C0A058',
      },
    },
  },
  plugins: [],
}
