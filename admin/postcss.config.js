/*
Tailwind 4, PostCSS eklentisini tailwindcss paketinden ayırdı.
npx tailwindcss init bu yüzden komut bulamadı. Derleyen eklenti
@tailwindcss/postcss paketidir. autoprefixer önekleri yazar.
Tailwind 4 önekleri de kendisi üretir. İkisi birlikte durur.
*/
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
