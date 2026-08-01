Kamu adalah motion designer senior yang spesialis membuat lower third dengan 
pendekatan animasi yang TIDAK LAZIM/TIDAK GENERIK. Buatkan komponen Remotion 
(React + TypeScript) dengan 10 KONSEP, di mana SETIAP konsep harus punya 
mekanisme reveal yang benar-benar berbeda secara struktural — bukan cuma 
beda warna atau beda arah slide.

===== MASALAH YANG HARUS DIHINDARI =====
99% lower third di pasaran stock asset pakai pola yang sama: satu bar 
solid slide masuk dari kiri/kanan, teks fade in, selesai. Ini yang saya 
sebut GENERIK dan DILARANG dipakai sebagai mekanisme utama:
- DILARANG: bar tunggal solid yang cuma translateX dari luar frame ke posisi akhir
- DILARANG: fade in/out sebagai satu-satunya mekanisme reveal
- DILARANG: semua elemen bergerak searah dan bersamaan tanpa variasi

===== CONTOH PENDEKATAN ANTI-GENERIK (referensi standar kualitas, JANGAN 
ditiru persis, tapi pahami levelnya) =====
- Bar dipecah jadi beberapa shard/potongan yang masing-masing datang dari 
  arah, sudut rotasi, dan waktu berbeda, lalu menyatu dengan overshoot
- Reveal dengan tepi tidak beraturan (jagged/torn edge) memakai clip-path 
  custom, bukan wipe kotak yang rapi
- Elemen "membuka" di ruang 3D (rotateX/rotateY dengan perspective), seperti 
  kartu yang tegak dari posisi rebah, bukan slide 2D datar
- Gerakan sekunder yang muncul SETELAH elemen utama settle (misalnya garis 
  aksen yang baru tumbuh setelah bar utama diam), bukan semua elemen 
  selesai bergerak di waktu yang sama

===== TUGAS =====
Ciptakan 10 KONSEP dengan MEKANISME REVEAL yang benar-benar berbeda satu 
sama lain (bukan variasi dari mekanisme yang sama). Untuk tiap konsep, 
pikirkan dulu: "elemen ini terlihat masuk ke frame dengan cara SEPERTI 
APA?" — jawabannya harus punya kata kerja/mekanisme unik (contoh cara 
berpikir, JANGAN dipakai sebagai daftar tetap, ciptakan sendiri yang lain): 
terpecah lalu menyatu, robek lalu tersingkap, terlipat lalu membuka, 
tersusun dari partikel yang menyatu, terpotong lalu bergeser saling 
mengunci, dll.

Setiap konsep WAJIB berbeda di:
- Mekanisme reveal utama (bukan cuma arah atau warna)
- Ada MINIMAL 1 gerakan sekunder yang terjadi dengan delay/timing berbeda 
  dari gerakan utama (bukan semua elemen bergerak dalam satu grup serentak)
- Ritme keseluruhan (ada yang cepat-tegas, ada yang lambat-dramatis, jangan 
  semua punya "rasa" kecepatan yang sama)

===== ATURAN WAJIB (non-negosiasi) =====

1. TIDAK ADA TEKS SAMA SEKALI di dalam komponen — area untuk nama/jabatan 
   HARUS DIBIARKAN KOSONG TOTAL (transparan, tidak ada placeholder text 
   apapun, tidak ada kotak/garis putus-putus sebagai penanda visual). 
   Tandai text-safe zone HANYA lewat comment di kode (posisi x/y, lebar, 
   tinggi), bukan elemen visual yang ikut ter-render

2. Semua bentuk WAJIB geometris dasar (rectangle, garis, polygon/clip-path 
   custom) — TIDAK ADA icon jadi dari library manapun

3. WAJIB pakai spring() dari Remotion untuk seluruh gerakan utama dan 
   gerakan sekunder. interpolate() hanya boleh untuk memetakan output 
   spring ke nilai visual, bukan membuat gerakan linear independen

4. Struktur waktu bebas kamu tentukan sesuai mekanisme konsepnya (tidak 
   harus persis "entrance-hold-exit" simetris), tapi harus ada momen 
   "settle/diam" yang cukup lama (minimal 3 detik) supaya teks buyer 
   terbaca

5. Resolusi 3840x2160, fps 30, durasi total 5-7 detik per konsep (sebutkan 
   durasi pasti + alasan)

6. Background transparan (AbsoluteFill tanpa backgroundColor), siap 
   render dengan alpha channel (ProRes 4444)

7. Props wajib: primaryColor, accentColor (hex, default value), delayFrame

8. Tambahkan subtle box-shadow untuk depth, jangan flat

===== LIBRARY YANG BOLEH DIPAKAI =====
CSS/inline style (termasuk clip-path, transform 3D/perspective), spring() 
dan interpolate() dari Remotion, @remotion/shapes, @remotion/noise, 
@remotion/paths jika perlu path custom. DILARANG icon library apapun.

===== OUTPUT FORMAT =====
Untuk SETIAP dari 10 konsep, tulis:
1. Nomor & Nama konsep
2. Mekanisme reveal dalam SATU kalimat (harus mengandung kata kerja unik, 
   bukan "slide in" atau "fade in")
3. Gerakan sekunder apa yang dipakai dan kapan triggernya
4. Text-safe zone (posisi & ukuran area kosong)
5. Kode lengkap komponen React (.tsx), dengan comment jelas menandai 
   text-safe zone

Sebelum menulis kode, cek dulu: apakah mekanisme konsep ini SAMA dengan 
konsep sebelumnya di list yang sama? Kalau ya, ganti dengan mekanisme lain.

Susun sebagai 10 blok kode terpisah dan jelas.