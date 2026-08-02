# MASTER PROMPT — Remotion "Animated Data Counter / Ticker Pack" (10 Varian)

> Cara pakai: copy-paste seluruh isi file ini ke AI coding assistant (Claude Code, Cursor, dsb) di dalam project Remotion kosong. Eksekusi satu bagian dulu (misal: setup + 1 komponen shared) sebelum minta generate 10 komposisi sekaligus, supaya AI tidak "ngarang" struktur yang tidak konsisten.

---

## 0. KONTEKS & TUJUAN

Saya kontributor Adobe Stock. Saya ingin membuat **10 aset video "Animated Data Counter / Ticker"** menggunakan Remotion (React + TypeScript). Aset ini akan dijual sebagai stock video template — dipakai orang untuk menampilkan angka statistik, harga, nilai mata uang, skor, atau metrik apa pun yang naik dari 0 ke nilai target dengan animasi menarik.

Kesepuluh aset harus **benar-benar berbeda** secara: palet warna, gaya visual, dan logika/gaya animasi angka — bukan cuma ganti warna dari template yang sama. Tujuannya supaya masing-masing terasa seperti produk yang berdiri sendiri, meski secara arsitektur kode tetap berbagi komponen inti (DRY).

---

## 1. SPESIFIKASI TEKNIS OUTPUT (WAJIB DIPATUHI SEMUA VARIAN)

- **Resolusi**: 3840 × 2160 (4K UHD), `fps: 30`
- **Durasi per komposisi**: 6–8 detik (180–240 frame @30fps), loopable di ujung bila memungkinkan (opsional, jangan dipaksakan jika merusak animasi)
- **Dua versi output per konsep**:
  1. **Alpha/transparan** — untuk di-overlay di atas video lain. Render pakai `codec: 'prores'`, `proResProfile: '4444'`, `pixelFormat` yang mendukung alpha (`yuva444p10le` via ProRes 4444), atau alternatif `codec: 'vp8'/'vp9'` dengan `transparent: true` untuk WebM alpha.
  2. **Background solid hitam (#000000)** — untuk preview marketplace / thumbnail, dan untuk pembeli yang tidak butuh alpha. Sama persis animasinya, hanya `backgroundColor` diisi solid.
- Struktur komposisi harus mendukung switch alpha/solid lewat **props**, bukan duplikasi file animasi (`background: 'alpha' | 'solid'`).
- Semua teks angka harus di-drive dari **props**, bukan hardcode — minimal props berikut wajib ada di setiap komposisi:
  ```ts
  type CounterProps = {
    targetValue: number;      // nilai akhir, contoh 1250000
    startValue?: number;      // default 0
    prefix?: string;          // contoh "$", "Rp"
    suffix?: string;          // contoh "%", " kWh"
    decimalPlaces?: number;   // default 0
    thousandsSeparator?: string; // default ","
    label?: string;           // contoh "TOTAL REVENUE"
    background: 'alpha' | 'solid';
    accentColor?: string;     // override warna aksen tanpa ubah kode
  };
  ```

---

## 2. ARSITEKTUR KODE YANG DIHARAPKAN

```
src/
  Root.tsx                     // registrasi semua <Composition>, 10 varian x 2 background = bisa 20 entry, atau 10 entry + props.background toggle di Studio
  components/
    CounterNumber.tsx          // logic hitung angka, format, easing — dipakai semua varian
    themes/
      minimalFintech.ts
      neonCyberpunk.ts
      luxuryGold.ts
      ecoMeter.ts
      cryptoGlass.ts
      retroTerminal.ts
      sportsFlip.ts
      medicalPulse.ts
      industrialGauge.ts
      socialPop.ts
  compositions/
    01-MinimalFintech.tsx
    02-NeonCyberpunk.tsx
    03-LuxuryGold.tsx
    04-EcoMeter.tsx
    05-CryptoGlass.tsx
    06-RetroTerminal.tsx
    07-SportsFlip.tsx
    08-MedicalPulse.tsx
    09-IndustrialGauge.tsx
    10-SocialPop.tsx
  utils/
    easings.ts                 // kumpulan custom easing/bezier
    formatNumber.ts             // format ribuan, desimal, prefix/suffix
```

**Prinsip wajib:**
- `CounterNumber.tsx` adalah komponen inti yang generic: terima `frame`, `fps`, `targetValue`, `easingFn`, kembalikan string angka yang sudah diformat pada frame tsb. Semua 10 varian memakai komponen ini, HANYA beda `easingFn`, style pembungkus, dan efek dekoratif di sekitarnya.
- Setiap varian di folder `compositions/` HANYA berisi: layout, style, efek dekoratif (particle/glow/scanline/dsb), dan pemanggilan `<CounterNumber />` + config dari `themes/`.
- Gunakan `interpolate()` dan `spring()` dari `remotion` untuk animasi, jangan CSS transition biasa (karena harus deterministik per-frame untuk render).
- Gunakan `useCurrentFrame()` dan `useVideoConfig()` di tiap composition.

---

## 3. SEPULUH KONSEP (WAJIB DIBUAT BERBEDA — JANGAN DIGABUNG/DISEDERHANAKAN)

Untuk setiap konsep di bawah, AI harus implementasi: **palet warna**, **tipografi angka**, **gaya animasi count-up**, dan **efek dekoratif** persis seperti dijabarkan.

### 1. Minimal Fintech Ledger
- Warna: background putih/abu sangat muda (versi solid: putih #FAFAFA), aksen navy `#1B2A4A`, teks angka hitam pekat.
- Tipografi: sans-serif tipis/light (contoh style Inter/Helvetica Light), tracking agak lebar.
- Animasi: count-up dengan easing "ease-out" halus (bukan bounce), digit naik smooth tanpa flip. Muncul garis tipis horizontal di bawah angka yang tumbuh dari 0% ke 100% width sinkron dengan progress angka.
- Dekorasi: minimal, hanya label kecil di atas angka (uppercase, letter-spacing lebar), fade-in halus.

### 2. Neon Cyberpunk HUD
- Warna: background hitam pekat, teks/glow magenta `#FF2E9E` dan cyan `#00F0FF` bergantian sebagai outline/glow.
- Tipografi: bold condensed, monospace-ish, terkesan digital.
- Animasi: di 10 frame pertama angka "glitch" (nilai acak berganti cepat + jitter posisi), lalu settle ke nilai final dengan sedikit chromatic aberration yang mereda.
- Dekorasi: scanline horizontal tipis bergerak turun terus-menerus, grid garis neon samar di background, glow pulsing mengikuti detak (bukan konstan).

### 3. Luxury Gold Foil
- Warna: background hitam, angka dengan gradient emas (`#D4AF37` ke `#F9E79F`), terkesan foil metalik.
- Tipografi: serif elegan (style Didot/Playfair), lebih besar dan berjarak.
- Animasi: angka muncul dari opacity 0 + scale 0.95 ke 1 secara lambat dan mewah (durasi lebih panjang dari yang lain, easing sangat halus/slow-in-slow-out), lalu ada "light sweep" — garis cahaya diagonal yang lewat di atas angka sekali seperti kilau foil.
- Dekorasi: garis tipis emas membingkai atas-bawah teks, partikel debu emas halus melayang pelan di background.

### 4. Eco / Renewable Energy Meter
- Warna: gradient hijau-teal (`#0F9B6E` ke `#38E1C6`), background solid gelap hijau tua atau alpha transparan.
- Tipografi: rounded sans-serif, tebal tapi ramah (bukan tajam).
- Animasi: ada **arc/lingkaran progress** melingkari angka yang terisi sinkron persis dengan nilai counting (0% arc = 0, 100% arc = target value), angka di tengah counting normal.
- Dekorasi: ikon daun kecil atau garis organik melengkung di tepi, animasi napas (scale in-out sangat halus) pada arc setelah selesai counting.

### 5. Crypto Glassmorphism
- Warna: gradient dark purple-blue (`#1A1035` ke `#2E1F5E`), card frosted glass semi-transparan dengan border tipis putih 10% opacity.
- Tipografi: geometric sans-serif modern, medium weight.
- Animasi: card glass "blur-in" dari blur tinggi + opacity 0 ke fokus penuh di awal, lalu angka counting dengan sedikit micro-chart candlestick line bergerak halus di belakang angka (dekoratif, tidak perlu akurat data).
- Dekorasi: noise/grain sangat halus di atas glass panel, refleksi cahaya tipis di tepi card.

### 6. Retro Terminal / Hacker
- Warna: background hitam pekat, teks hijau phosphor `#33FF33` monospace, sedikit noise CRT.
- Tipografi: monospace murni (style terminal, Courier/JetBrains Mono).
- Animasi: angka muncul **karakter demi karakter seperti diketik** (typewriter), termasuk digit yang dihitung tampil bertahap kiri-ke-kanan, dengan cursor blok berkedip di akhir setelah selesai.
- Dekorasi: scanline CRT horizontal, sedikit distorsi vignette di tepi layar, flicker opacity sangat halus meniru monitor lama.

### 7. Sports Scoreboard Bold
- Warna: kontras tinggi merah `#E30613` + hitam + putih, seperti papan skor stadion.
- Tipografi: bold condensed super tebal (style athletic/jersey number).
- Animasi: **mechanical split-flap counter** — tiap digit terlihat seperti kartu yang membalik (flip vertikal) satu-satu dari 0 sampai berhenti di angka final, bukan smooth interpolate biasa. Ada sedikit "shake"/getar di frame board saat digit flip.
- Dekorasi: garis diagonal khas jersey di background, border kotak tegas mengelilingi angka seperti bingkai papan skor.

### 8. Medical / Health Dashboard
- Warna: putih/abu sangat muda + aksen mint `#2FD4A5` dan biru muda `#4A90D9`.
- Tipografi: rounded sans-serif bersih, medium weight, sangat readable.
- Animasi: counting angka disertai **garis heartbeat/EKG** tipis di bawah angka yang berdenyut (naik-turun berulang) selama counting berlangsung, lalu melandai jadi garis datar setelah angka selesai (seperti "stabil").
- Dekorasi: ikon plus/cross medis sangat subtle di sudut, ring/lingkaran tipis progress mengelilingi (mirip smartwatch health ring).

### 9. Industrial Utility Gauge
- Warna: dark metal gray `#2B2B2E` + aksen amber/orange `#FFA726` sebagai warning/highlight.
- Tipografi: digital seven-segment style untuk angka utama (seperti display listrik), label kecil di sampingnya sans-serif teknikal.
- Animasi: kombinasi **jarum analog (needle) yang menyapu** dari kiri ke posisi sesuai persentase nilai, DAN angka digital di bawahnya counting sinkron dengan posisi jarum.
- Dekorasi: tekstur metal brushed halus di background, baut/rivet dekoratif di sudut panel, sedikit getar/vibration mekanis di needle saat berhenti (overshoot kecil lalu settle).

### 10. Vibrant Social Gradient Pop
- Warna: gradient vibrant multicolor (pink `#FF3CAC` → orange `#FF9F1C` → ungu `#7B2FF7`), berubah posisi gradient perlahan (animated gradient, bukan statis).
- Tipografi: rounded bold playful (style Poppins ExtraBold/Baloo), besar dan berani.
- Animasi: angka counting dengan **elastic overshoot** (angka "melewati" nilai target sedikit lalu mantul balik ke nilai benar — pakai `spring()` dengan damping rendah), dan saat mencapai nilai final ada **confetti/partikel kecil meledak** sesaat di sekitar angka.
- Dekorasi: bentuk blob organik animasi lambat di background, sticker-style shadow di bawah angka.

---

## 4. INSTRUKSI EKSEKUSI UNTUK AI

Kerjakan berurutan, jangan loncat:

1. Setup project Remotion (kalau belum ada): `npx create-video@latest` template blank TypeScript.
2. Buat `utils/formatNumber.ts` dan `utils/easings.ts` dulu, tunjukkan ke saya sebelum lanjut.
3. Buat `components/CounterNumber.tsx` — generic, terima `easingFn` sebagai prop function, bukan hardcode easing di dalamnya.
4. Buat SATU komposisi contoh dulu (Minimal Fintech Ledger) end-to-end termasuk registrasi di `Root.tsx`, saya cek dulu sebelum lanjut ke 9 sisanya.
5. Setelah saya approve struktur di langkah 4, baru generate sisa 9 komposisi lain dengan pola arsitektur yang sama, masing-masing mengikuti spesifikasi warna/tipografi/animasi/dekorasi persis seperti Bagian 3.
6. Terakhir, buat `remotion.config.ts` dengan setting render default: `Config.setCodec('h264')` untuk preview cepat, dan sertakan juga contoh command render terpisah untuk output alpha ProRes 4444 dan output solid H.264 4K.

**Larangan:**
- Jangan bikin 10 komposisi jadi satu file besar dengan switch-case warna saja — animasi & layout harus benar-benar beda kode, bukan cuma ganti variable warna.
- Jangan pakai library animasi luar Remotion (Framer Motion dsb) untuk animasi utama — pakai `interpolate`/`spring` bawaan Remotion supaya render frame-by-frame konsisten.
- Jangan hardcode ukuran teks/posisi tanpa referensi ke `useVideoConfig()` (biar scalable kalau nanti saya ubah resolusi).

