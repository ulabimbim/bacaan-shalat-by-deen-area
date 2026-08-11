# PRD — PWA Variasi Bacaan Shalat

## Instruksi untuk Coding Agent

Bangun aplikasi sampai selesai dan dapat dijalankan. Jangan berhenti pada tahap perencanaan, wireframe, atau scaffolding.

Gunakan dua file berikut sebagai satu paket handoff:

1. `PRD_Variasi_Bacaan_Shalat.md`
2. `Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx`

Workbook terkurasi adalah sumber data utama. Jangan mengubah, meringkas, memperbaiki, atau menafsirkan ulang teks Arab, transliterasi, arti, dan rujukan agama di luar data workbook. Jika ada keputusan teknis kecil yang tidak dijelaskan dalam PRD, pilih solusi paling sederhana yang tetap memenuhi acceptance criteria.

---

## 1. Ringkasan Produk

**Nama kerja:** Variasi Bacaan Shalat  
**Bentuk:** Progressive Web App, mobile-first  
**Bahasa antarmuka:** Bahasa Indonesia  
**Target pengguna:** Muslim Indonesia yang ingin mengenal variasi bacaan shalat sesuai urutan bagian shalat  
**Nilai utama:** Pengguna dapat memilih satu bagian shalat, lalu membaca variasi bacaannya satu per satu dalam tampilan yang tenang dan mudah dipahami.

Aplikasi ini bukan aplikasi tata cara shalat lengkap, bukan alat penilaian hafalan, dan bukan ensiklopedia fikih. Fokusnya hanya satu: **menampilkan variasi bacaan berdasarkan urutan shalat**.

## 2. Keputusan Produk yang Sudah Dikunci

- Hanya ada satu struktur utama: **Urutan Shalat**.
- Tidak ada bottom navigation.
- Tidak ada login atau akun pengguna.
- Tidak ada backend atau database online untuk MVP.
- Tidak ada audio.
- Tidak ada fitur latihan, status hafalan, fokus pekan ini, streak, kuis, atau gamifikasi.
- Tidak ada pencarian, favorit, notifikasi, pembayaran, AI, atau analytics.
- Semua konten tersedia secara offline setelah aplikasi pertama kali dimuat.
- Data production hanya berasal dari baris dengan `siap_publish = Ya`.
- Empat bacaan berstatus tahan tidak boleh tampil di aplikasi.

Jangan menambahkan fitur di luar scope tersebut, walaupun terlihat mudah dibuat.

## 3. Tujuan dan Bukan Tujuan

### Tujuan

1. Pengguna langsung memahami bahwa bacaan dikelompokkan menurut urutan shalat.
2. Pengguna dapat membuka suatu bagian shalat maksimal dengan satu tap.
3. Pengguna dapat berpindah antarvariasi tanpa kembali ke halaman utama.
4. Teks Arab menjadi fokus visual utama, tetapi transliterasi, arti, sumber, dan konteks tetap mudah ditemukan.
5. Aplikasi ringan, dapat dipasang ke homescreen, dan tetap berfungsi tanpa koneksi.
6. Workbook dapat diganti atau diperbarui kemudian tanpa menulis ulang data secara manual di source code.

### Bukan tujuan MVP

- Mengajarkan gerakan atau tata cara shalat dari awal.
- Menentukan satu bacaan sebagai yang paling utama.
- Memberikan fatwa atau keputusan tarjih.
- Memaksa semua bacaan dibaca atau digabungkan.
- Menjadi dashboard administrasi konten.
- Menyimpan progres lintas perangkat.

## 4. User Flow

### Flow utama

1. Pengguna membuka aplikasi.
2. Pengguna melihat daftar bagian shalat dalam urutan vertikal.
3. Pengguna mengetuk salah satu bagian, misalnya **Rukuk**.
4. Aplikasi membuka variasi pertama yang lolos filter publish.
5. Pengguna membaca teks Arab, transliterasi, arti, serta sumber dan keterangan bila diperlukan.
6. Pengguna menekan **Berikutnya** atau **Sebelumnya** untuk berpindah variasi.
7. Pengguna menekan tombol kembali untuk kembali ke Urutan Shalat.

Tidak ada onboarding. Tidak ada splash screen buatan. Pengguna harus langsung tiba di halaman Urutan Shalat.

## 5. Struktur Layar

MVP hanya memiliki dua tampilan aplikasi.

### 5.1 Halaman Urutan Shalat

#### Header

- Judul: **Variasi Bacaan Shalat**
- Subjudul: **Kenali variasi bacaan sesuai urutan shalat.**
- Catatan singkat:

  > Sebagian bacaan merupakan alternatif dan sebagian memiliki konteks khusus. Buka sumber dan keterangan sebelum mengamalkannya.

#### Daftar bagian

Tampilkan bagian shalat sebagai alur vertikal. Setiap item terdiri dari:

- Nomor urutan dua digit, misalnya `01`.
- Nama bagian.
- Jumlah variasi yang lolos filter publish.
- Ikon panah kanan.

Contoh:

> 03  
> **Rukuk**  
> 7 variasi  →

Seluruh permukaan item dapat diketuk. Urutkan menggunakan kolom `urutan` pada sheet `Bagian Shalat`.

#### Jumlah yang harus tampil

Jumlah ini dihitung dari `Variasi Bacaan` setelah filter `siap_publish = Ya`. Jangan menggunakan nilai mentah `jumlah_variasi` dari sheet `Bagian Shalat`, karena angka itu masih menghitung bacaan yang ditahan.

| Urutan | bagian_id | Nama | Jumlah publish |
|---:|---|---|---:|
| 1 | `doa_istiftah` | Doa Istiftah | 12 |
| 2 | `taawudz` | Ta’awudz Sebelum Al-Fatihah | 3 |
| 3 | `rukuk` | Rukuk | 7 |
| 4 | `itidal` | I‘tidal | 12 |
| 5 | `sujud` | Sujud | 10 |
| 6 | `duduk_antara_dua_sujud` | Duduk Antara Dua Sujud | 4 |
| 7 | `tasyahhud` | Tasyahhud | 7 |
| 8 | `shalawat_setelah_tasyahhud` | Shalawat Setelah Tasyahhud | 6 |
| 9 | `doa_sebelum_salam` | Doa Sebelum Salam | 14 |
| 10 | `salam` | Salam | 4 |

Total: **10 bagian dan 79 variasi publish**.

### 5.2 Halaman Detail Bagian

#### App bar

- Tombol kembali dengan label aksesibel **Kembali ke Urutan Shalat**.
- Nama bagian, misalnya **Rukuk**.
- Jumlah variasi publish pada bagian tersebut.

#### Posisi deck

Tampilkan:

> **Variasi 1 dari 7**

Nomor yang terlihat harus dinomori ulang secara berurutan setelah filter publish. Jangan menampilkan nomor yang melompat hanya karena sebuah `bacaan_id` ditahan. ID asli tetap dipertahankan secara internal.

Gunakan progress line tipis di bawah penanda variasi. Jangan menggunakan banyak dot karena beberapa bagian memiliki sampai 14 variasi.

#### Kartu bacaan

Urutan isi kartu:

1. Badge `subkategori` bila nilainya tidak kosong.
2. Teks Arab.
3. Transliterasi.
4. Arti.
5. Accordion **Sumber dan keterangan**.

Teks Arab selalu terlihat dan menjadi fokus utama. Transliterasi dan arti juga tampil secara default agar pengguna tidak perlu membuka banyak kontrol hanya untuk membaca satu bacaan.

##### Aturan badge subkategori

- Tampilkan isi `subkategori` persis sebagaimana data, misalnya **Umum**, **Shalat malam**, atau **Dari Ibnu Mas’ud**.
- Jangan membuat filter atau tab subkategori pada MVP.
- Urutan deck tetap mengikuti `urutan_variasi` setelah filter publish.

##### Aturan beberapa segmen

Satu bacaan dapat memiliki lebih dari satu baris pada sheet `Teks Bacaan`. Gabungkan berdasarkan `bacaan_id`, lalu urutkan menggunakan `urutan_segmen`.

- Jika hanya ada satu segmen dan `label_segmen` adalah label generik seperti **Bacaan utama**, label boleh disembunyikan.
- Jika ada lebih dari satu segmen, tampilkan seluruh segmen secara terpisah beserta `label_segmen` masing-masing.
- Jangan menggabungkan dua segmen menjadi satu paragraf.
- Implementasi wajib menangani contoh publish multi-segmen: `istiftah-01`, `salam-02`, dan `salam-04`.

Untuk teks Arab:

- Gunakan `dir="rtl"` hanya pada elemen teks Arab.
- Rata kanan.
- Pertahankan harakat, tanda baca, spasi internal, dan urutan teks sebagaimana workbook.

##### Isi accordion Sumber dan keterangan

Tampilkan field yang tersedia dengan urutan berikut:

1. `rujukan_hadis` dengan label **Rujukan**.
2. `jenis_dalil` dengan label **Jenis dalil**.
3. `keterangan` dengan label **Keterangan**, bila tidak kosong.
4. `konteks_penggunaan` dengan label **Konteks penggunaan**, bila tidak kosong.
5. Tautan **Buka sumber** menggunakan `url_verifikasi`; jika kosong, gunakan `url_sumber`; jika keduanya kosong, jangan tampilkan tombol tautan.
6. `sumber_referensi` boleh ditampilkan sebagai teks sumber tambahan bila nilainya tersedia dan tidak sama dengan URL yang sudah ditampilkan.

Tautan eksternal dibuka pada tab baru dengan `rel="noopener noreferrer"`.

Jangan tampilkan field editorial internal berikut kepada pengguna:

- `status_kelengkapan`
- `tingkat_rujukan`
- `status_kurasi`
- `catatan_kurasi`
- `siap_publish`
- `baris_sumber`
- `nomor_sumber`

#### Navigasi variasi

Di bawah kartu tampilkan dua tombol:

- **Sebelumnya**
- **Berikutnya**

Aturan:

- Pada variasi pertama, tombol Sebelumnya disabled.
- Pada variasi terakhir, tombol Berikutnya disabled.
- Setiap perpindahan membawa viewport kembali ke bagian atas kartu, bukan ke paling atas halaman.
- Navigasi horizontal dengan swipe boleh ditambahkan sebagai enhancement, tetapi tombol tetap menjadi kontrol utama.
- Tombol panah kiri/kanan pada keyboard boleh digunakan untuk navigasi selama fokus tidak sedang berada pada tautan atau kontrol accordion.

## 6. Routing

Gunakan routing yang tetap bekerja pada static hosting tanpa konfigurasi rewrite khusus.

Rute yang disarankan:

- `#/` — Urutan Shalat
- `#/bagian/:bagianId?bacaan=:bacaanId` — Detail bagian dan bacaan aktif

Gunakan Hash Router atau implementasi setara yang ringan.

Persyaratan:

- Refresh pada halaman detail tidak menghasilkan 404.
- Tombol browser Back mengembalikan pengguna ke halaman sebelumnya.
- Deep link dengan `bagian_id` dan `bacaan_id` valid membuka bacaan yang benar.
- Jika ID tidak valid atau bacaan tidak publish, tampilkan pesan sederhana **Bacaan tidak ditemukan** dan tombol **Kembali ke Urutan Shalat**. Jangan membocorkan alasan kurasi.

## 7. Sumber Data dan Transformasi Workbook

### 7.1 Workbook sumber

Nama file:

`Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx`

Sheet `Panduan` hanya untuk dokumentasi dan tidak perlu masuk ke bundle aplikasi.

### 7.2 Relasi sheet

#### `Bagian Shalat`

| Kolom | Fungsi |
|---|---|
| `urutan` | Urutan bagian pada halaman utama |
| `bagian_id` | Primary key bagian |
| `nama_bagian` | Nama yang ditampilkan |
| `jumlah_variasi` | Jumlah mentah; jangan digunakan untuk count UI |
| `keterangan` | Deskripsi internal bagian |

#### `Variasi Bacaan`

Primary key: `bacaan_id`  
Foreign key: `bagian_id` → `Bagian Shalat.bagian_id`

Kolom lengkap:

`bacaan_id`, `urutan_global`, `urutan_bagian`, `bagian_id`, `nama_bagian`, `subkategori`, `urutan_variasi`, `nomor_sumber`, `judul_asli`, `konteks_penggunaan`, `rujukan_hadis`, `keterangan`, `sumber_referensi`, `url_sumber`, `baris_sumber`, `jumlah_segmen`, `status_kelengkapan`, `jenis_dalil`, `tingkat_rujukan`, `status_kurasi`, `catatan_kurasi`, `url_verifikasi`, `siap_publish`.

#### `Teks Bacaan`

Primary key: `teks_id`  
Foreign key: `bacaan_id` → `Variasi Bacaan.bacaan_id`

Kolom:

`teks_id`, `bacaan_id`, `urutan_segmen`, `label_segmen`, `teks_arab`, `transliterasi`, `arti`.

### 7.3 Aturan import wajib

1. Baca workbook pada build time, bukan di browser saat runtime.
2. Filter `Variasi Bacaan` dengan kondisi string persis `siap_publish === "Ya"`.
3. Buang semua `Teks Bacaan` yang `bacaan_id`-nya tidak termasuk hasil filter publish.
4. Urutkan bagian berdasarkan `Bagian Shalat.urutan` ascending.
5. Urutkan bacaan dalam bagian berdasarkan `urutan_variasi` ascending.
6. Urutkan segmen berdasarkan `urutan_segmen` ascending.
7. Pertahankan `bagian_id`, `bacaan_id`, dan `teks_id` sebagai ID stabil. Jangan menggunakan nomor baris spreadsheet sebagai ID.
8. Nilai sel kosong dapat diubah menjadi `null`, tetapi jangan mengubah isi teks nonkosong.
9. Jangan melakukan normalisasi Unicode, transliterasi ulang, atau koreksi otomatis pada teks Arab.
10. Hitung `displayOrder` dan `publishedCount` setelah filter publish.

### 7.4 Baris yang wajib dikeluarkan

Empat ID berikut tidak boleh masuk JSON production atau UI:

- `rukuk-02`
- `sujud-02`
- `duduk-dua-sujud-05`
- `salam-05`

Jangan hardcode daftar ini sebagai satu-satunya mekanisme filter. Sumber kebenaran tetap kolom `siap_publish`; daftar ini digunakan untuk automated test dan pemeriksaan hasil.

### 7.5 Output data yang disarankan

Buat script idempotent, misalnya:

`scripts/generate-data.ts`

Input:

`data/source/Database_Variasi_Bacaan_Shalat_Terkurasi.xlsx`

Output:

`src/data/shalat.generated.json`

Struktur output yang disarankan:

```json
{
  "version": 1,
  "sections": [
    {
      "id": "rukuk",
      "order": 3,
      "name": "Rukuk",
      "publishedCount": 7,
      "readings": [
        {
          "id": "rukuk-01",
          "displayOrder": 1,
          "sourceOrder": 1,
          "subcategory": null,
          "segments": [
            {
              "id": "rukuk-01-s01",
              "order": 1,
              "label": "Bacaan utama",
              "arabic": "...",
              "transliteration": "...",
              "meaning": "..."
            }
          ],
          "reference": {
            "text": "...",
            "evidenceType": "...",
            "note": null,
            "context": null,
            "sourceReference": "...",
            "url": "..."
          }
        }
      ]
    }
  ]
}
```

Nama properti output boleh disesuaikan selama seluruh aturan relasi, filter, urutan, dan tampilan tetap dipenuhi.

### 7.6 Validasi build data

Script harus gagal dengan pesan jelas jika:

- Workbook tidak ditemukan.
- Salah satu dari tiga sheet data tidak ditemukan.
- Kolom wajib hilang.
- Ada `bagian_id`, `bacaan_id`, atau `teks_id` duplikat pada primary key masing-masing.
- Ada foreign key yang tidak ditemukan.
- Ada bacaan publish tanpa minimal satu segmen.
- Ada segmen publish tanpa `teks_arab`, `transliterasi`, atau `arti`.

Hasil transformasi workbook saat PRD ini dibuat harus menghasilkan:

- 10 bagian.
- 79 bacaan publish.
- 82 segmen publish.
- 0 dari empat ID tahan di bundle production.

## 8. Arah Visual

### Karakter

Minimal, tenang, modern, dan terasa premium. Kesan Islami datang dari kualitas tipografi Arab dan ketelitian konten, bukan dari ornamen berlebihan.

Hindari:

- Ilustrasi masjid yang dekoratif.
- Bulan sabit sebagai ornamen berulang.
- Pola geometris Islami yang ramai.
- Gradient mencolok.
- Glassmorphism.
- Shadow tebal.
- Emoji sebagai ikon.
- Tampilan dashboard atau kartu statistik.

### Token visual awal

Gunakan CSS variables agar mudah diubah:

```css
--color-bg: #F6F3EC;
--color-surface: #FFFEFA;
--color-ink: #20231F;
--color-muted: #71756E;
--color-accent: #33473B;
--color-accent-soft: #E6ECE7;
--color-border: #DDDAD1;
--radius-card: 22px;
--radius-control: 14px;
--content-width: 680px;
```

### Tipografi

- UI: Inter atau sans-serif modern yang setara.
- Arab: Noto Naskh Arabic atau font Arab lokal yang sangat terbaca.
- Bundle font secara lokal agar tetap tersedia offline.
- Teks Arab menggunakan ukuran responsif sekitar `clamp(1.9rem, 7vw, 2.65rem)` dan line-height sekitar `1.9`.
- Body text minimal 16px.

### Layout

- Mobile-first.
- Lebar konten maksimum sekitar 680px dan dipusatkan pada desktop.
- Padding horizontal mobile 20px.
- Target sentuh minimal 44 × 44px.
- Gunakan whitespace yang cukup; jangan memadatkan teks Arab.
- Pada desktop, aplikasi tetap terlihat sebagai reading experience yang fokus, bukan melebar memenuhi layar.

### Gerak

- Transisi singkat dan halus, sekitar 160–220ms.
- Tidak ada animasi dekoratif terus-menerus.
- Hormati `prefers-reduced-motion`.

### Ikon

Gunakan pustaka ikon yang konsisten seperti Lucide untuk panah, kembali, dan tautan eksternal. Jangan menggambar ikon dengan karakter teks atau emoji.

## 9. Spesifikasi Teknis

### Stack yang disarankan

- React
- TypeScript dengan strict mode
- Vite
- `vite-plugin-pwa`
- React Router menggunakan Hash Router
- Library pembaca XLSX hanya pada script build data
- Plain CSS atau CSS Modules dengan design tokens; tidak perlu component library berat

Jika repository yang diberikan sudah memiliki stack setara, pertahankan stack tersebut dan adaptasikan persyaratan tanpa migrasi yang tidak perlu.

### Arsitektur

- Static frontend.
- Tidak ada API, server, database, autentikasi, atau environment secret.
- Workbook disimpan sebagai source content di repository.
- JSON hasil transformasi dibundle bersama aplikasi.
- Parsing XLSX tidak ikut ke bundle browser.
- `npm run dev` dan `npm run build` harus menjalankan atau memastikan data generation sudah terbaru.

### Target deployment

Aplikasi harus dapat di-build sebagai static site dan siap di-deploy ke Cloudflare Pages.

- Build command: `npm run build`
- Output directory: `dist`
- Tidak membutuhkan server-side rendering.
- Tidak membutuhkan rewrite khusus karena routing menggunakan hash.

## 10. Persyaratan PWA dan Offline

Manifest minimum:

- `name`: Variasi Bacaan Shalat
- `short_name`: Variasi Shalat
- `lang`: `id`
- `display`: `standalone`
- `start_url`: aplikasi root
- `theme_color`: `#33473B`
- `background_color`: `#F6F3EC`

Sediakan ikon PWA ukuran yang diperlukan. Jika belum ada brand asset final, gunakan ikon sementara yang sangat sederhana, monokrom, dan mudah diganti; jangan memperlakukannya sebagai logo final.

Service worker harus melakukan precache terhadap:

- App shell.
- JavaScript dan CSS hasil build.
- JSON konten.
- Font lokal.
- Ikon aplikasi.

Acceptance offline:

1. Buka aplikasi sekali ketika online.
2. Aktifkan mode offline.
3. Reload aplikasi.
4. Halaman utama, seluruh detail bacaan, transliterasi, arti, serta metadata sumber berbasis teks tetap dapat dibuka.
5. Tautan eksternal boleh gagal ketika offline; aplikasi tidak boleh ikut crash.

Tidak perlu membuat custom install prompt pada MVP.

## 11. Accessibility dan Responsiveness

- Gunakan `<html lang="id">`.
- Gunakan elemen semantik: `header`, `main`, `nav`, `button`, dan heading berurutan.
- Jangan menerapkan RTL pada seluruh halaman; hanya pada teks Arab.
- Semua tombol ikon memiliki accessible name.
- Focus ring keyboard terlihat jelas.
- Warna teks memenuhi kontras minimum WCAG AA.
- Accordion dapat digunakan dengan keyboard dan mengumumkan state `aria-expanded`.
- Disabled state tombol Sebelumnya/Berikutnya tidak hanya dibedakan dengan warna.
- Tidak ada horizontal overflow pada lebar 320px.
- Verifikasi minimal pada viewport 390 × 844 dan desktop 1440px.

## 12. State Kosong dan Error

### Data gagal dimuat

Tampilkan:

> **Data bacaan belum dapat dibuka.**  
> Coba muat ulang aplikasi.

Sediakan tombol **Muat ulang**.

### Bagian tanpa bacaan publish

Secara default jangan tampilkan bagian tanpa bacaan publish pada halaman utama. Jika keadaan ini terjadi karena pembaruan data, data generator harus memberikan warning.

### Route tidak valid

Tampilkan:

> **Bacaan tidak ditemukan.**

Sediakan tombol **Kembali ke Urutan Shalat**.

## 13. Automated Tests Minimum

### Data tests

- Menghasilkan tepat 10 bagian.
- Menghasilkan tepat 79 bacaan publish.
- Menghasilkan tepat 82 segmen publish.
- Tidak memasukkan `rukuk-02`, `sujud-02`, `duduk-dua-sujud-05`, atau `salam-05`.
- Count publish per bagian sesuai tabel pada bagian 5.1.
- Semua `bacaan_id` publish memiliki minimal satu segmen.
- `istiftah-01`, `salam-02`, dan `salam-04` mempertahankan lebih dari satu segmen dalam urutan yang benar.
- Semua ID dan relasi unik serta valid.

### UI tests

- Halaman utama menampilkan 10 bagian dalam urutan yang benar.
- Mengetuk Rukuk membuka detail dengan label `Variasi 1 dari 7`.
- Navigasi berikutnya dan sebelumnya mengubah bacaan aktif.
- Tombol Sebelumnya disabled pada variasi pertama.
- Tombol Berikutnya disabled pada variasi terakhir.
- Browser Back kembali ke Urutan Shalat.
- Badge subkategori tampil hanya jika nilai tersedia.
- Accordion sumber menampilkan rujukan dan menyembunyikan field editorial internal.
- Route ke bacaan yang ditahan diperlakukan sebagai bacaan tidak ditemukan.

### Build tests

- TypeScript check lulus.
- Test suite lulus.
- Production build lulus.
- PWA manifest dan service worker terbuat pada build production.

## 14. Definition of Done

Pekerjaan dianggap selesai bila:

- PWA sudah diimplementasikan, bukan hanya dirancang.
- Scope hanya mencakup Urutan Shalat dan deck variasi bacaan.
- Workbook terkurasi menjadi sumber data build.
- Filter publish dan seluruh relasi data bekerja benar.
- 79 bacaan dan 82 segmen publish dapat diakses.
- Empat bacaan tahan tidak ada di aplikasi.
- Multi-segmen tampil benar.
- Desain mobile dan desktop rapi tanpa overflow atau teks terpotong.
- Aplikasi dapat dipasang dan digunakan offline setelah kunjungan pertama.
- Seluruh test dan production build lulus.
- Repository memiliki README singkat berisi:
  - Cara install dependency.
  - Cara menjalankan development server.
  - Cara menjalankan test.
  - Cara build production.
  - Cara memperbarui workbook dan menghasilkan ulang JSON.
  - Cara deploy folder `dist` ke Cloudflare Pages.
- Tidak ada TODO utama, mock data, atau placeholder konten yang masih dipakai pada core flow.

## 15. Prioritas Implementasi

Jika waktu terbatas, urutkan pekerjaan sebagai berikut:

1. Transformasi dan validasi workbook.
2. Halaman Urutan Shalat dengan count publish yang benar.
3. Detail bacaan dan navigasi variasi.
4. Dukungan multi-segmen dan metadata sumber.
5. Responsive visual polish dan accessibility.
6. PWA/offline.
7. Automated tests dan dokumentasi.

Jangan mengorbankan integritas data untuk menambah fitur atau animasi.
