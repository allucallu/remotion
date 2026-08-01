Kamu adalah Lead Motion Designer & Creative Technologist yang mengeksekusi animasi Lower Third kelas tinggi menggunakan Remotion (React + TypeScript). 

Tugasmu adalah membuat komponen Remotion untuk 10 KONSEP Lower Third yang radikal, eksperimental, dan ANTI-GENERIK. Seluruh animasi harus terasa sinematik, presisi, dan memiliki "bobot fisik" (high-end motion dynamics).

===== FISIKA MOTION & ATURAN SPRING (WAJIB) =====
1. DILARANG MENGGUNAKAN ANIMASI LINEAR SEDERHANA ATAU TRANSLATE-X BIASA.
2. Semua gerakan utama dan sekunder WAJIB menggunakan `spring()` dari Remotion dengan konfigurasi parameter eksplisit:
   - Gerakan Cepat/Tegas: `{ mass: 0.5, damping: 12, stiffness: 200 }`
   - Gerakan Elegat/Dramatis: `{ mass: 2, damping: 20, stiffness: 80 }`
   - Gerakan Snap/Micro: `{ mass: 0.1, damping: 8, stiffness: 300 }`
3. Gunakan `interpolate()` HANYA untuk memetakan hasil nilai `spring` ke properti CSS (`transform`, `clipPath`, `opacity`, `filter`).

===== DILARANG KERAS (GENERIK TRAPS) =====
- DILARANG: Bar tunggal utuh yang cuma slide/swipe dari luar layar.
- DILARANG: Hanya mengandalkan Fade In / Opacity sebagai animasi masuk utama.
- DILARANG: Semua elemen bergerak bersamaan tanpa hirarki waktu (stagger/delay).
- DILARANG: Menampilkan teks, huruf, placeholder text, atau garis/kotak batas tempat teks. Area teks HARUS 100% transparan.

===== PEMBAGIAN 10 KONSEP DALAM 5 TEMA =====

[TEMA 1: ARCHITECTURAL & SPATIAL 3D]
- Konsep 1 (Origami Fold): Membuka ruang dari garis tipis 1px, lalu terlipat keluar secara 3D (perspective + rotateX/rotateY) hingga membentuk bidang datar.
- Konsep 2 (Depth Slate): Plat geometris tegak lurus dari posisi rebah 90 derajat dengan efek ketebalan/shadow 3D yang dinamis saat mendarat.

[TEMA 2: DESTRUCTIVE & FRACTURED]
- Konsep 3 (Shard Fusion): 4-6 pecahan polygon (clip-path custom) datang dari rotasi & koordinat acak, meluncur lalu mengunci (snap) menjadi satu kesatuan.
- Konsep 4 (Tectonic Shift): Dua blok warna berlawanan bergeser saling memotong dan mengunci di tengah dengan gerakan sekunder berupa garis aksen kejutan.

[TEMA 3: KINETIC GRID & SWISS DESIGN]
- Konsep 5 (Crosshair Expand): Dimulai dari titik silang aksen (crosshair) kecil yang meledak memekar membentuk grid geometris asymmetrical.
- Konsep 6 (Modular Stacking): Urutan balok-balok ukuran rasio presisi yang muncul secara staggered (bertahap cepat) membentuk ruang komposisi.

[TEMA 4: ORGANIC & NOISE DISTORTION]
- Konsep 7 (Viscous Tear): Membran clip-path yang robek/tertarik dari tengah secara elastis dengan overshoot sebelum settle stabil.
- Konsep 8 (Algorithmic Noise Sweep): Efek tererosi/robek tidak beraturan yang bergerak menyapu frame menggunakan kalkulasi math/noise.

[TEMA 5: TEMPORAL & GLITCH DATA]
- Konsep 9 (Scanline Fracture): Garis pemindai ultra-cepat yang meninggalkan jejak blok geometris solid yang mengendap.
- Konsep 10 (Slit-Scan Slice): Bidang utama terbagi menjadi 5 tirai horizontal tipis yang masuk berurutan dengan delay milidetik (staggered cascade).

===== SPESIFIKASI TEKNIS WAJIB =====
1. Resolution: 3840x2160 (4K UHD), Frame Rate: 30 FPS.
2. Durasi tiap konsep: 5 Sampai 6 Detik (Diatur via AbsoluteFill / Sequence).
3. Settle/Hold Duration: Minimal 3.5 detik (frame diam sempurna di tengah agar aman dibaca).
4. Exit Animation: WAJIB ada animasi keluar yang tidak kalah kompleks dengan animasi masuk (misal: dekonstruksi balik atau memutar menghilang).
5. Background: Transparent (`AbsoluteFill` tanpa warna latar belakang).
6. Props Komponen (TypeScript Interface):
   ```tsx
   interface LowerThirdProps {
     primaryColor?: string; // Default: e.g. "#0F172A"
     accentColor?: string;  // Default: e.g. "#38BDF8"
     delayFrame?: number;   // Default: 0
   }