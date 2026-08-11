# PWA Bacaan Shalat

Progressive Web App untuk mengenal bacaan shalat sesuai urutan bagian shalat. Data berasal dari `Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx` dan hanya menampilkan bacaan dengan `siap_publish = Ya`.

## Prasyarat

- Node.js 18 atau lebih baru
- npm

## Install dependency

```bash
npm install
```

## Jalankan development server

```bash
npm run dev
```

Aplikasi akan tersedia di `http://localhost:5173/`.

## Instalasi sebagai PWA

Pada browser mobile yang mendukung instalasi PWA, aplikasi menampilkan pemberitahuan **Tambahkan ke Home** setelah event instalasi tersedia. Pada Safari iPhone/iPad, ikuti petunjuk **Bagikan → Tambahkan ke Layar Utama**.

Prompt instalasi hanya muncul ketika aplikasi belum berjalan sebagai aplikasi standalone. Pada production, aplikasi harus dibuka melalui HTTPS agar service worker dan instalasi PWA aktif.

## Jalankan test

```bash
npm test
```

Untuk menjalankan test dalam mode watch:

```bash
npm run test:watch
```

## Build production

```bash
npm run build
```

Build akan menghasilkan folder `dist/` yang siap di-deploy sebagai static site.

## Memperbarui workbook

1. Ganti atau perbarui file di `data/source/Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx`.
2. Jalankan generator data secara manual:

   ```bash
   npm run generate
   ```

3. Generator akan menghasilkan ulang `src/data/shalat.generated.json` dan ikon PWA, serta melakukan validasi jumlah bagian, bacaan, dan segmen publish.
4. Jalankan test dan build untuk memastikan tidak ada regresi.

## Deploy ke Cloudflare Pages

1. Hubungkan repository GitHub ini ke Cloudflare Pages.
2. Gunakan pengaturan berikut:
   - Framework preset: `Vite`
   - Build command: `npm run build`
   - Output directory: `dist`
3. Alternatifnya, unggah isi folder `dist/` melalui Wrangler:

   ```bash
   npx wrangler pages deploy dist
   ```

4. Tambahkan custom domain `bacaanshalat.deenarea.id` pada menu **Custom domains** Cloudflare Pages dan ikuti instruksi DNS yang diberikan Cloudflare.
5. Tidak diperlukan konfigurasi rewrite karena routing menggunakan hash (`/#/` dan `/#/bagian/:bagianId`).

## Struktur data

- `data/source/Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx` — sumber data asli.
- `scripts/generate-data.ts` — skrip build-time untuk membaca workbook dan menghasilkan JSON.
- `scripts/generate-icons.ts` — skrip build-time untuk menghasilkan ikon PWA dari SVG.
- `src/data/shalat.generated.json` — data yang dibundle bersama aplikasi.

## Fitur

- Mobile-first dan responsive.
- Offline-ready berkat service worker dan precache dari `vite-plugin-pwa`.
- Dua layar: Urutan Shalat dan Detail Bacaan.
- Navigasi variasi dengan tombol Sebelumnya/Berikutnya, swipe, dan keyboard.
- Teks Arab dengan tipografi Noto Naskh Arabic lokal.
- Tidak ada backend, login, audio, atau fitur di luar scope PRD.
