# 🎮 MINIMALIST NEON IDLE GAME HUD — 15 PROMPT TEMPLATES
### Siap pakai di Antigravity IDE → Remotion

---

## ═══ GLOBAL DESIGN SYSTEM ═══
> Wajib dibaca sebelum eksekusi. Semua 15 asset menggunakan sistem ini.

```
CANVAS         : 1920×1080px
FPS            : 30
BACKGROUND     : #080808 (bukan pure black — sedikit lebih hidup)
EXPORT         : MP4 H.264 / MOV ProRes 422

COLOR PALETTE:
  Primary Neon    : #00F5FF  (cyan electric)
  Secondary Neon  : #FF2D78  (magenta)
  Warning         : #FFD700  (gold)
  Danger          : #FF3B30  (red alert)
  Success         : #39FF14  (lime)
  Text Primary    : #E8E8E8  (off-white)
  Text Dim        : #6B7280  (abu redup)
  Glow Base       : same as neon color at 40% opacity

GLOW FORMULA (copy-paste untuk semua elemen neon):
  filter: drop-shadow(0 0 3px [color]) 
          drop-shadow(0 0 10px [color]) 
          drop-shadow(0 0 25px [color]40)

TYPOGRAPHY:
  Font Utama    : "Share Tech Mono" (Google Fonts) — angka, HUD data
  Font Label    : "Rajdhani" (Google Fonts) — teks label, uppercase
  Letter Spacing: 0.2em sampai 0.35em
  Text Transform: uppercase semua

IDLE MICRO-ANIMATION (tambahkan ke semua asset setelah animasi utama):
  Elemen neon utama : pulse opacity 0.8 → 1.0 → 0.8, 90 frame cycle
  Teks label        : flicker 1 frame opacity 0.2 tiap ~80-100 frame (acak)
  JANGAN pulse semua elemen bersamaan — offset minimal 15 frame
```

---

## ITEM 01 — Hexagon Grid Expansion

```
Buat Remotion component bernama "HexagonGridExpansion".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 210 frame (7 detik) — seamless loop

VISUAL:
- Grid 37 heksagon SVG (pola 4 ring konsentris dari center)
- Setiap heksagon: SVG <polygon>, stroke #00F5FF, stroke-width 1px, fill none
- Ukuran per heksagon: radius 45px
- Glow: filter drop-shadow(0 0 3px #00F5FF) drop-shadow(0 0 10px #00F5FF) drop-shadow(0 0 25px #00F5FF40)
- Heksagon menyala berurutan dari center → luar (ring 0 dulu, lalu ring 1, dst)

ANIMATION:
- Frame 0-150   : Heksagon menyala stagger, delay 4 frame per hex
                  Setiap hex: opacity 0 → 1, durasi 10 frame, pakai interpolate dengan Easing.easeOut
- Frame 150-180 : Semua hex ON — pulse glow opacity filter 0.7 → 1.0 → 0.7
- Frame 180-210 : Seluruh grid fade out opacity 1 → 0, Easing.easeIn
- Frame 210     : Loop kembali ke frame 0

TEXT:
- Font: "Share Tech Mono", size 16px, color #E8E8E8, letter-spacing 0.3em, uppercase
- Konten: "ZONE UNLOCKED"
- Posisi: center-bottom, translateY(380px dari center)
- Muncul frame 70: fade in 15 frame
- Flicker di frame 130 (opacity → 0.1 selama 1 frame), frame 133 (opacity → 0.1 selama 1 frame)
- Ikut fade out bersama grid di frame 180-210

EASING: Gunakan spring(frame - delayFrame, {fps:30, stiffness:100, damping:22}) untuk momen "klik" saat hex menyala
```

---

## ITEM 02 — Auto-Turret Range Indicator

```
Buat Remotion component bernama "AutoTurretRange".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — seamless loop

VISUAL:
- Titik center (turret): lingkaran kecil solid #00F5FF, radius 6px, di tengah canvas
- Lingkaran luar dashed: SVG <circle>, radius 280px, center canvas
  stroke #00F5FF, stroke-width 1.5px
  stroke-dasharray: "12 8" (12px dash, 8px gap)
  fill: none
- Glow lingkaran: filter drop-shadow(0 0 4px #00F5FF) drop-shadow(0 0 14px #00F5FF50)
- Kilatan "lock" di akhir: flash white di seluruh stroke, 3 frame, lalu kembali cyan

ANIMATION:
- Frame 0-100  : Lingkaran dashed expand dari radius 0 → 280px
                 Gunakan spring(frame, {fps:30, stiffness:60, damping:18})
                 Sekaligus stroke-dashoffset berputar: dari 200 → 0 (clockwise rotation feel)
- Frame 100-130: Lingkaran sudah penuh — rotasi lambat stroke-dashoffset berkelanjutan
                 + titik center pulse scale 1 → 1.4 → 1 (spring, 20 frame)
- Frame 130-145: LOCK — stroke warna berubah #00F5FF → #FFFFFF, opacity 1 → 0 → 1 cepat (flash)
                 Tambah lingkaran ke-2 concentric, radius 300px, opacity 0 → 0.4 → 0 (ripple)
- Frame 145-180: Hold state — dashed line rotasi perlahan, titik center idle pulse
- Frame 180    : Loop

TEXT:
- "TARGET ACQUIRED" — font "Share Tech Mono", size 14px, #E8E8E8, letter-spacing 0.35em
- Posisi: 60px di atas center canvas
- Muncul frame 130 bersamaan dengan LOCK event: fade in 8 frame
- Subtle flicker tiap ~50 frame setelah muncul
```

---

## ITEM 03 — Endless Wave Progress

```
Buat Remotion component bernama "EndlessWaveProgress".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 120 frame (4 detik) — seamless loop

VISUAL:
- Progress bar: posisi top canvas, y=80px, full width 1920px
- Bar track (background): height 2px, color #1A1A1A, opacity 1
- Bar fill: height 2px, color #00F5FF
- Glow fill: filter drop-shadow(0 0 4px #00F5FF) drop-shadow(0 0 12px #00F5FF60)
- Di ujung kanan bar fill: titik lingkaran kecil radius 4px, warna #00F5FF, glow lebih intens
- Separator line vertical tipis di setiap 25% lebar (4 titik checkpoint): opacity 0.15, warna #00F5FF

ANIMATION:
- Frame 0-100  : Bar fill width dari 0% → 100% canvas width
                 Gunakan interpolate(frame, [0,100], [0, 1920]) dengan Easing.linear
                 Titik ujung ikut bergerak bersama width
- Frame 100-105: Reset instant — width kembali ke 0 (no animation, hard cut)
- Frame 105-120: Mulai fill lagi dari 0%, preview awal loop berikutnya
- Frame 120    : Loop ke frame 0

TEKS ATAS BAR:
- Kiri: "WAVE 42" — font "Rajdhani", size 11px, #6B7280, letter-spacing 0.25em, uppercase
  posisi x=0, y=55px
- Kanan: "INCOMING..." — font "Rajdhani", size 11px, #FF3B30, letter-spacing 0.25em
  posisi x=1920px (right-aligned), y=55px
  Fade in: "WAVE 42" opacity 1→0 dari frame 80-100, "INCOMING..." opacity 0→1 dari frame 85-105
  Tambah pulse pada "INCOMING..." — opacity 0.6↔1.0 setiap 15 frame
```

---

## ITEM 04 — Idle Resource Generator

```
Buat Remotion component bernama "IdleResourceGenerator".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — seamless loop

VISUAL UTAMA:
- Angka tebal di center canvas
- Font: "Share Tech Mono", size 96px, weight 700, color #00F5FF
- Glow teks: filter drop-shadow(0 0 6px #00F5FF) drop-shadow(0 0 20px #00F5FF50)
- Nilai angka: interpolasi dari 1.0K → 9.7K sepanjang 180 frame
  Format: nilai < 1000 tampilkan angka biasa, >= 1000 tampilkan "X.XK"
  Gunakan: const value = interpolate(frame, [0,180], [1000, 9700])
           const display = (value / 1000).toFixed(1) + "K"

PARTIKEL:
- 20 partikel debu neon kecil bergerak ke atas dari center
- Setiap partikel: lingkaran radius 2-3px (random), warna #00F5FF atau #39FF14
- Spawn dari area center ±150px horizontal
- Gerak: translateY dari 0 → -300px per partikel, durasi 60-80 frame (random)
- opacity: 1 → 0 sepanjang perjalanan (fade out saat naik)
- Stagger spawn: tiap 9 frame spawn 1 partikel baru
- Implementasi: gunakan .map() dengan seed per partikel untuk Math.sin/cos pseudo-random konsisten

LABEL BAWAH:
- "+1.5K/sec" — font "Rajdhani", size 18px, #39FF14, letter-spacing 0.2em, uppercase
- Posisi: 80px di bawah angka utama
- "AUTO-COLLECT" — font "Rajdhani", size 11px, #6B7280, letter-spacing 0.35em
- Posisi: 110px di bawah angka utama
- Keduanya idle — tidak beranimasi, hanya tampil statis

EASING: Angka naik linear (tidak perlu easing — simulasi real-time counter)
```

---

## ITEM 05 — Tech Tree / Skill Node

```
Buat Remotion component bernama "TechTreeNode".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 210 frame (7 detik) — one-shot dengan hold

LAYOUT NODE (posisi absolut, koordinat dari top-left canvas):
  Node A (root)    : x=960, y=700  ← center-bottom
  Node B (kiri)    : x=640, y=500
  Node C (kanan)   : x=1280, y=500
  Node D (target)  : x=960, y=300  ← node yang aktif

VISUAL NODE:
- Setiap node: lingkaran SVG radius 18px, stroke #00F5FF 1.5px, fill #080808
- Node aktif (D): radius 22px, fill #00F5FF20, stroke lebih tebal 2px
- Glow node aktif: drop-shadow(0 0 6px #00F5FF) drop-shadow(0 0 20px #00F5FF60)

VISUAL GARIS KONEKSI:
- Garis lurus SVG dari A→B, A→C, B→D, C→D
- stroke #00F5FF, stroke-width 1px, opacity 0.4
- Glow tipis: drop-shadow(0 0 3px #00F5FF30)

ANIMATION SEQUENCE:
- Frame 0-30    : Canvas hitam, fade in garis koneksi opacity 0→0.4
- Frame 30-90   : Node A,B,C muncul satu per satu, stagger 20 frame, scale 0→1 spring
                  spring({fps:30, stiffness:150, damping:20})
- Frame 90-140  : Garis dari B→D dan C→D: stroke-dashoffset animasi (line draw effect)
                  Durasi 30 frame per garis, B→D mulai frame 90, C→D mulai frame 110
- Frame 140-165 : Node D muncul — scale 0→1.2→1, spring overshoot
                  Bersamaan: flash bright #FFFFFF opacity 0→1→0 selama 8 frame (kilat)
                  Glow intens sesaat: drop-shadow scale up 2x selama 10 frame
- Frame 165-210 : Hold state
                  Node D idle pulse: scale 1→1.05→1 setiap 30 frame
                  Glow bernapas: opacity filter 0.6→1.0→0.6

TEXT (muncul bersamaan Node D di frame 140):
- "SKILL UNLOCKED" — "Share Tech Mono", 15px, #E8E8E8, letter-spacing 0.3em
- Posisi: 50px di atas Node D (y=250)
- Fade in 12 frame
- "NODE ACTIVATED" — "Rajdhani", 11px, #6B7280, letter-spacing 0.25em
- Posisi: 30px di bawah teks utama
- Fade in 8 frame delay 5 frame setelah teks utama
```

---

## ITEM 06 — Floating Damage Numbers

```
Buat Remotion component bernama "FloatingDamageNumbers".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 150 frame (5 detik) — seamless loop

SISTEM PARTIKEL ANGKA:
- Total: 12 angka floating muncul bergantian selama durasi
- Spawn dari area center ±80px (sebar tidak terlalu lebar)
- Setiap angka adalah komponen independen dengan props: {value, startFrame, angle, speed}

DATA ANGKA (hardcode untuk konsistensi visual):
  [
    {value: "-847",      startFrame: 0,   angle: -60, size: 28px, color: "#FF3B30"},
    {value: "CRITICAL",  startFrame: 8,   angle: -90, size: 20px, color: "#FFD700"},
    {value: "-2.1K",     startFrame: 18,  angle: -45, size: 34px, color: "#FF2D78"},
    {value: "-999",      startFrame: 30,  angle: -115,size: 40px, color: "#FF3B30"},
    {value: "DPS 14.5K", startFrame: 40,  angle: -75, size: 16px, color: "#E8E8E8"},
    {value: "-503",      startFrame: 52,  angle: -55, size: 24px, color: "#FF3B30"},
    {value: "CRITICAL",  startFrame: 62,  angle: -100,size: 18px, color: "#FFD700"},
    {value: "-1.8K",     startFrame: 75,  angle: -85, size: 32px, color: "#FF2D78"},
    {value: "-321",      startFrame: 90,  angle: -70, size: 22px, color: "#FF3B30"},
    {value: "-4.2K",     startFrame: 100, angle: -50, size: 38px, color: "#FF2D78"},
    {value: "DPS 18K",   startFrame: 112, angle: -90, size: 14px, color: "#6B7280"},
    {value: "CRITICAL",  startFrame: 125, angle: -80, size: 22px, color: "#FFD700"},
  ]

ANIMATION PER ANGKA:
- Durasi hidup setiap angka: 45 frame
- Gerak: translateX = Math.cos(angle) * speed * localFrame
         translateY = Math.sin(angle) * speed * localFrame — nilai negatif (ke atas)
         speed default = 3.5
- Opacity: frame 0-8 → fade in, frame 8-30 → opacity 1, frame 30-45 → fade out
- Scale: spawn dari 1.3 → 1.0 dalam 8 frame (pop effect)
- Font: "Share Tech Mono", weight 700, letter-spacing 0.1em
- Glow: drop-shadow(0 0 4px [color]) drop-shadow(0 0 12px [color]60)

CENTER ELEMENT:
- Titik impact di center canvas: lingkaran radius 8px, color #FFFFFF
- Flash opacity 1→0 selama 6 frame di awal setiap "hit batch"
- Hit batch tiap 50 frame (frame 0, 50, 100)
```

---

## ITEM 07 — Minimalist Upgrade Panel

```
Buat Remotion component bernama "UpgradePanel".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 210 frame (7 detik) — one-shot dengan hold

PANEL UTAMA:
- Kotak center canvas: width 520px, height 360px
- Background: rgba(0, 245, 255, 0.04) — hampir invisible, hanya hint
- Border: 1px solid #00F5FF, opacity 0.8
- Corner accent: garis pendek 20px di setiap sudut (bukan border penuh, hanya corner bracket)
  warna #00F5FF, width 2px, glow drop-shadow(0 0 6px #00F5FF)

PANEL TITLE (dalam panel, y=top+30px):
- "UPGRADE AVAILABLE" — "Rajdhani", 12px, #6B7280, letter-spacing 0.4em
- Garis separator: 1px solid #00F5FF20, width 80%, margin: 8px auto

STAT BARS (5 bar vertikal, stagger masuk):
  Label dan nilai:
  1. ATK POWER    ████████░░  80%
  2. FIRE RATE    ██████░░░░  60%  
  3. RANGE        █████████░  90%
  4. SHIELD       ████░░░░░░  40%
  5. SPEED        ███████░░░  70%

  Setiap bar:
  - Track: height 3px, width 340px, color #1A1A1A
  - Fill: height 3px, color #00F5FF, glow drop-shadow(0 0 4px #00F5FF)
  - Label kiri: "Rajdhani" 11px, #6B7280, letter-spacing 0.2em
  - Nilai kanan: "Share Tech Mono" 11px, #E8E8E8

ANIMATION:
- Frame 0-20   : Panel border draw — corner brackets muncul scale 0→1, spring stiff
- Frame 20-40  : Panel background fade in: opacity 0→1
- Frame 40-170 : Bar masuk stagger, delay 20 frame per bar
                 Setiap bar fill: width 0% → target%, durasi 30 frame
                 Easing: interpolate dengan Easing.easeOut
- Frame 170-210: Hold — semua bar tampil penuh

BOTTOM TEXT (muncul frame 160):
- "MAX LEVEL" — "Share Tech Mono", 13px, #FFD700, letter-spacing 0.3em
- Fade in 10 frame, sedikit bounce (scale 0.9→1.05→1)
- Glow: drop-shadow(0 0 6px #FFD700)
- Atau "COST: ERROR" (buat dua versi sebagai variasi export)

IDLE STATE (frame 170-210):
- Corner bracket pulse opacity 0.5→1.0→0.5, setiap 30 frame
- Bar fill glow: drop-shadow scale naik turun halus
```

---

## ITEM 08 — Geometry Spawn Radar

```
Buat Remotion component bernama "SpawnRadar".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — seamless loop

RADAR BASE:
- Center canvas, radius total 300px
- Lingkaran terluar: SVG circle, stroke #00F5FF20, stroke-width 1px, fill none
- Lingkaran tengah: radius 200px, stroke #00F5FF15, stroke-width 1px
- Lingkaran dalam: radius 100px, stroke #00F5FF20, stroke-width 1px
- Garis silang (crosshair): 2 garis tipis melintang center, stroke #00F5FF10, stroke-width 1px

SWEEP LINE (radar sweep):
- SVG line dari center ke radius 300px
- Mulai dari atas (angle -90deg), rotasi 360deg sepanjang 120 frame (2 detik per rotasi)
- Warna gradient: dari #00F5FF di ujung line, fade ke transparent di center
- Glow: drop-shadow(0 0 8px #00F5FF)
- Gunakan CSS transform rotate() diupdate per frame: `rotate(${(frame % 120) * 3}deg)`

FADE TRAIL:
- Di belakang sweep line: 3 trail line dengan opacity 0.3, 0.15, 0.05
- Offset angle: -15deg, -30deg, -45deg dari sweep line

ENEMY DOTS:
- 8 titik musuh: lingkaran radius 4px, warna #FF3B30
- Glow: drop-shadow(0 0 6px #FF3B30)
- Posisi: random di dalam lingkaran (set posisi statis, bukan random runtime)
  Contoh posisi (x offset dari center, y offset):
  [(-180,80), (120,-200), (-60,-150), (200,120), (-230,-40), (80,220), (-100,180), (160,-80)]
- Blink: setiap titik blink opacity 1→0.1→1, stagger 10 frame antar titik
- Titik "dekat center" (< 100px dari center): warna lebih terang, blink lebih cepat

LABEL:
- "RADAR ONLINE" — "Rajdhani", 11px, #6B7280, letter-spacing 0.35em
- Posisi: 340px di bawah center (di luar lingkaran radar)
- "SPAWN RATE INCREASED" — "Share Tech Mono", 13px, #FF3B30, letter-spacing 0.2em
- Posisi: 20px di bawah teks pertama
- Pulse opacity kedua teks: 0.6→1.0→0.6, 60 frame cycle, offset 15 frame
```

---

## ITEM 09 — Energy Shield Bar

```
Buat Remotion component bernama "EnergyShield".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 240 frame (8 detik) — one-shot dengan loop

SHAPE PILIHAN: Gunakan arc/kurva atas (setengah lingkaran), bukan heksagon penuh
  Center: canvas center, radius 320px
  Arc dari angle -150deg ke -30deg (melengkung di atas)
  SVG path atau <arc> element

VISUAL SHIELD:
- Track arc: stroke #1A1A2E, stroke-width 8px, fill none
- Fill arc: stroke-width 8px, stroke-linecap round
- Warna fill menggunakan interpolateColors bawaan Remotion

ANIMATION SEQUENCE:
- Frame 0-30    : Shield muncul — stroke-dashoffset dari 0% → full arc length
                  Warna: #00F5FF (shield penuh biru neon)
                  Glow: drop-shadow(0 0 8px #00F5FF) drop-shadow(0 0 20px #00F5FF50)
                  Teks: "SHIELD 100%" muncul fade in

- Frame 30-120  : Shield RETAK — fill arc berkurang dari 100% → 25%
                  Warna transisi: interpolateColors(frame, [30,120], ['#00F5FF','#FF3B30'])
                  Glow berubah: #00F5FF → #FF3B30
                  Getaran (shake): translateX Math.sin(frame*0.8)*3, hanya frame 60-90
                  Teks update: "SHIELD 25%" dengan warna ikut merah
                  Flash putih: opacity burst di frame 65 selama 4 frame

- Frame 120-180 : Shield RECHARGE — fill arc naik dari 25% → 100%
                  Warna: interpolateColors(frame, [120,180], ['#FF3B30','#00F5FF'])
                  Easing: Easing.easeInOut — lambat di awal, cepat di akhir
                  Teks: "RECHARGING..." berkedip selama fase ini

- Frame 180-240 : Shield penuh kembali
                  Glow intens sesaat (frame 180-190): scale glow 2x
                  Teks: "SHIELD 100%" kembali, warna #00F5FF
                  Idle pulse glow hingga loop

TEXT POSISI: 60px di bawah arc, center horizontal
Font: "Share Tech Mono", 16px, letter-spacing 0.25em
```

---

## ITEM 10 — Idle Multiplier Meter

```
Buat Remotion component bernama "MultiplierMeter".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — seamless loop

ELEMEN UTAMA — ANGKA RAKSASA:
- Font: "Share Tech Mono", size 160px, weight 700
- Posisi: center canvas, sedikit ke kiri (x=800px center)
- Konten: "x" + nilai multiplier
  Nilai naik: interpolate(frame, [0,150], [1, 10]) — format "x1" → "x10"
  Gunakan Math.floor() untuk tampilan integer
- Warna: #00F5FF
- Glow intensitas naik seiring nilai:
  Awal (x1) : drop-shadow(0 0 4px #00F5FF) drop-shadow(0 0 10px #00F5FF30)
  Akhir (x10): drop-shadow(0 0 8px #00F5FF) drop-shadow(0 0 30px #00F5FF) drop-shadow(0 0 60px #00F5FF40)
  Gunakan interpolate untuk nilai glow spread

CINCIN ORBITAL:
- 3 lingkaran SVG concentric di kanan angka (x=1200px, center y)
  Ring 1: radius 60px, stroke-width 2px, #00F5FF, rotasi searah jarum jam
  Ring 2: radius 90px, stroke-width 1.5px, #00F5FF60, rotasi berlawanan
  Ring 3: radius 120px, stroke-width 1px, #00F5FF30, rotasi searah, lebih lambat
- Kecepatan rotasi ikut nilai multiplier:
  speed = 1 + (frame/150) * 4  → makin cepat seiring naik
  rotation = frame * speed (derajat per frame)
- Ketebalan glow rings juga intensif ikut nilai

PARTIKEL ORBITAL (opsional tapi premium):
- 4 titik kecil mengorbit Ring 1, posisi ikut cos/sin
- Warna #FFD700, radius 3px

LABEL:
- "MULTIPLIER ACTIVE" — "Rajdhani", 13px, #6B7280, letter-spacing 0.3em
- Posisi: 120px di bawah angka
- "x10 COMBO" muncul di frame 150 dengan pop scale 0→1.3→1 spring
  Warna #FFD700, ukuran 24px, glow gold

FRAME 150-180: Hold state — angka "x10" tetap, semua ring + glow pulse
```

---

## ITEM 11 — System Prestige / Rebirth

```
Buat Remotion component bernama "PrestigeRebirth".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 210 frame (7 detik) — one-shot cinematic

PHASE 1: BUILD UP (Frame 0-90)
- Background tetap hitam
- Teks "PRESTIGE READY" di center: "Share Tech Mono", 28px, #E8E8E8, letter-spacing 0.4em
  Fade in frame 0-20
  Pulse lambat opacity 0.7→1.0→0.7, cycle 30 frame
- Lingkaran aura di center: radius tumbuh lambat 20→80px
  stroke #FFFFFF20, stroke-width 1px, no fill
  Tambah 2 cincin concentric dengan opacity makin kecil
- Partikel kecil melayang ke center dari 4 sudut canvas
  20 partikel, warna #FFFFFF, opacity 0.3-0.6

PHASE 2: FLASH (Frame 90-130)
- Lingkaran putih solid di center: radius expand dari 0 → 2000px
  (cukup untuk cover seluruh canvas 1920x1080 adalah radius ~1100px, target 1400px untuk aman)
  Gunakan: const radius = interpolate(frame-90, [0,40], [0, 1400], {easing: Easing.easeIn})
  Warna: #FFFFFF, fill solid (bukan stroke)
- Semua elemen Phase 1 langsung opacity 0 di frame 90
- Di frame 120: seluruh canvas = putih solid

PHASE 3: AFTERMATH (Frame 130-210)
- Canvas fade dari putih (#FFFFFF) → hitam (#080808)
  interpolateColors(frame, [130,170], ['#FFFFFF','#080808'])
- Teks baru muncul fade in dari frame 150:
  "RESETTING SYSTEM..." — "Share Tech Mono", 20px, #E8E8E8, letter-spacing 0.5em
  Ketik efek: tampilkan karakter satu per satu, 2 frame per karakter
  Cursor blink: "|" di ujung teks, blink setiap 15 frame
- Grid scanline tipis: horizontal lines setiap 4px, opacity 0.03, #FFFFFF
  Fade in frame 150-180 sebagai texture atmosfer

NOTE: Asset ini tidak loop — eksport sebagai one-shot. Buat versi reversed juga (hitam → flash → kembali normal) sebagai variasi.
```

---

## ITEM 12 — Boss Encounter Warning

```
Buat Remotion component bernama "BossWarning".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — seamless loop

HAZARD TAPE ATAS DAN BAWAH:
- Stripe diagonal menggunakan CSS repeating-linear-gradient
- Atas: posisi y=0, height 60px
  background: repeating-linear-gradient(
    -45deg,
    #FFD700 0px, #FFD700 30px,
    #1A1A1A 30px, #1A1A1A 60px
  )
  background-size: 85px 85px (ukuran tile stripe)
- Bawah: posisi y=1020px (bottom), height 60px, identik

ANIMATION TAPE:
- Stripe bergerak ke kanan secara continuous:
  background-position: animasi dari 0px → 85px sepanjang 60 frame, lalu reset
  Gunakan: backgroundPositionX = `${(frame % 60) * (85/60)}px`
- Opacity tape: frame 0-15 fade in, loop hingga akhir

EFEK ALERT DI TENGAH:
- Flash merah keseluruhan canvas: rgba(255, 59, 48, 0.08) overlay
  Blink on/off setiap 20 frame: opacity 0 → 0.08 → 0 (2 frame transition)
- Garis border merah: 2px solid #FF3B30 di semua 4 sisi canvas, inset 30px dari tepi
  Glow: drop-shadow inward (gunakan box-shadow pada div overlay)

CENTER TEXT:
- "⚠ BOSS WAVE" — "Share Tech Mono", 42px, weight 700, #FFD700, letter-spacing 0.2em
  Glow: drop-shadow(0 0 8px #FFD700) drop-shadow(0 0 25px #FFD70060)
- "WARNING" — "Rajdhani", 16px, #FF3B30, letter-spacing 0.6em
  Posisi: 50px di bawah teks utama
- Kedua teks blink bersamaan alert overlay: scale pulse 1.0→1.02→1.0 per blink

SCANLINE EFFECT:
- Overlay tipis: horizontal stripe setiap 3px, rgba(0,0,0,0.2)
  Static — tidak bergerak — hanya texture menambah kesan monitor tua
```

---

## ITEM 13 — Offline Earnings Popup

```
Buat Remotion component bernama "OfflineEarnings".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 240 frame (8 detik) — one-shot dengan hold

PHASE 1: POPUP MASUK (Frame 0-40)
- Panel kotak: width 560px, height 400px, center canvas
- Background: #0D0D14 (dark blue-black)
- Border: 1px solid #00F5FF60
- Corner brackets: 4 sudut, style sama dengan Item 07
- ANIMATION masuk: translateY dari -800px → 0 dengan spring bounce
  spring(frame, {fps:30, stiffness:180, damping:15})
  → ini yang membuat "bouncy" yang satisfying
  Juga scale dari 0.85 → 1.0 bersamaan (spring sama)

PANEL HEADER:
- Background strip: rgba(0, 245, 255, 0.08), height 60px, full panel width
- "OFFLINE PROGRESS" — "Rajdhani", 12px, #6B7280, letter-spacing 0.45em
- Ikon: lingkaran kecil hijau pulse di kiri header (status indicator): radius 5px, #39FF14

PANEL CONTENT (muncul stagger setelah panel masuk, frame 40-120):
- "SYNCING DATA..." — "Share Tech Mono", 13px, #6B7280, letter-spacing 0.2em
  Progress dots animasi: "SYNCING." → "SYNCING.." → "SYNCING..." ganti tiap 15 frame
  Muncul frame 40-80 lalu hilang (diganti dengan data)

- Data rows (muncul frame 80-140, stagger 15 frame per row):
  Row 1: "TIME AWAY"    [  8h 42m  ]
  Row 2: "GOLD EARNED"  [  +847.2K ]  ← warna #FFD700
  Row 3: "EXP GAINED"   [  +12.5M  ]  ← warna #39FF14
  Row 4: "ITEMS FOUND"  [  ×23     ]  ← warna #FF2D78
  
  Format per row: label kiri (#6B7280), nilai kanan (warna masing-masing)
  Font: "Share Tech Mono", 14px
  Setiap nilai: counter animation — angka naik dari 0 ke target dalam 20 frame
  Garis separator tipis antar row: #1A1A2E

- Tombol COLLECT (frame 140):
  Kotak: width 200px, height 40px, border 1px solid #00F5FF
  Background: #00F5FF15
  Teks: "COLLECT ALL" — "Rajdhani", 12px, #00F5FF, letter-spacing 0.3em
  Pulse border glow: terus-menerus hingga end frame
  Scale: pop masuk 0.9→1.05→1.0 spring

PHASE 2: HOLD (Frame 140-240)
- Semua konten tampil statis
- Border panel pulse subtle
- Tombol COLLECT glow intens setiap 45 frame
```

---

## ITEM 14 — Core Overclock

```
Buat Remotion component bernama "CoreOverclock".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — one-shot dengan acceleration

GEAR DESIGN (minimalis line-only, bukan solid):
- Implementasikan sebagai SVG path atau gabungan <polygon> dan <circle>
- Gear luar: 12 gigi, outer radius 180px, inner radius 140px
  Gigi: trapezoid shape, height 40px, setiap gigi dipisah gap 10deg
  Style: stroke only, stroke #00F5FF, stroke-width 1.5px, fill none
- Ring tengah: circle radius 100px, stroke #00F5FF, stroke-width 1px
- Hub tengah: circle radius 30px, stroke #00F5FF, stroke-width 2px
  Fill: #00F5FF10
  Glow intens: drop-shadow(0 0 8px #00F5FF) drop-shadow(0 0 20px #00F5FF)
- Spoke lines: 6 garis dari hub ke ring tengah (setiap 60deg), stroke #00F5FF50

ROTATION ACCELERATION:
- Kecepatan rotasi menggunakan formula eksponensial:
  rotationDeg = Math.pow(frame, 1.25) * 0.15
  (frame 1 → 0.15deg, frame 50 → ~45deg, frame 100 → ~119deg, frame 180 → ~290deg)
- Gear luar rotate searah jarum jam
- Gear kedua (inner, radius 80px, 8 gigi): rotate berlawanan dengan speed 1.5x

MOTION BLUR SIMULASI:
- Tidak bisa true motion blur di CSS/SVG, tapi simulasikan dengan:
  Render 3 copy gear dengan opacity 0.15, 0.08, 0.04
  Setiap copy di-offset rotation -2deg, -5deg, -10deg dari gear utama
  Ini menciptakan "smear" visual

GLOW ESCALATION:
- Frame 0-60   : drop-shadow(0 0 4px #00F5FF) drop-shadow(0 0 10px #00F5FF30)
- Frame 60-120 : drop-shadow(0 0 6px #00F5FF) drop-shadow(0 0 18px #00F5FF50)
- Frame 120-180: drop-shadow(0 0 10px #00F5FF) drop-shadow(0 0 30px #00F5FF) drop-shadow(0 0 60px #00F5FF30)
  Interpolate smooth antar phase

TEXT:
- "OVERCLOCK INITIATED" — "Share Tech Mono", 16px, #E8E8E8, letter-spacing 0.25em
  Posisi: 240px di bawah gear center
  Muncul frame 0, fade in 20 frame
- "SPEED: MAX" — "Share Tech Mono", 28px, #00F5FF, letter-spacing 0.2em
  Muncul frame 130 (saat gear hampir max speed): pop scale 0→1.2→1, spring
  Glow: drop-shadow(0 0 8px #00F5FF)
```

---

## ITEM 15 — Neon Particle Loot Drop

```
Buat Remotion component bernama "NeonLootDrop".

CANVAS: 1920x1080, background #080808, 30fps
DURASI: 180 frame (6 detik) — one-shot

PHASE 1: DIAMOND FORM (Frame 0-60)
- Wajik SVG di center canvas: 4 titik koordinat (center-top, right, bottom, left)
  Ukuran: 80px × 80px (half-size dari tip ke center)
  Style: stroke only, stroke #00F5FF, stroke-width 2px, fill none
- Masuk: scale 0→1 spring(frame, {fps:30, stiffness:200, damping:18}) — pop keras
- Glow: drop-shadow(0 0 6px #00F5FF) drop-shadow(0 0 20px #00F5FF60)
- Rotasi lambat: 0deg → 45deg sepanjang frame 0-60
- Inner glow pulse: fill berkedip #00F5FF05 → #00F5FF15 → #00F5FF05, cycle 20 frame
- Teks "RARE DROP" di atas wajik, muncul frame 20:
  "Share Tech Mono", 14px, #FFD700, letter-spacing 0.3em
  Glow: drop-shadow(0 0 6px #FFD700)

PHASE 2: EXPLODE (Frame 60-65)
- Flash: seluruh wajik opacity 1→2→0 (overbright sesaat) — 3 frame
- Wajik mulai pecah: 4 segitiga (4 sisi wajik) fly out ke arah masing-masing
  Segitiga atas: translateY -200px, opacity 1→0, 20 frame
  Segitiga kanan: translateX +200px, opacity 1→0, 20 frame
  Segitiga bawah: translateY +200px, opacity 1→0, 20 frame
  Segitiga kiri: translateX -200px, opacity 1→0, 20 frame

PHASE 3: PARTICLE BURST (Frame 60-140)
- 40 partikel memancar radial dari center
  Implementasi dengan .map() — setiap partikel punya angle unik (360/40 * index)
  Variasi: Math.sin(index * 7.3) * 15deg offset untuk less uniform

  Per partikel:
  - radius lingkaran: 2-4px (alternating kecil-besar)
  - Warna: alternating #00F5FF, #FFD700, #FF2D78 sesuai index % 3
  - Glow: drop-shadow(0 0 4px [color])
  - Gerak: translateX = Math.cos(angle) * distance
           translateY = Math.sin(angle) * distance
           distance = interpolate(frame-60, [0,60], [0, 280])
           Easing: Easing.easeOut (cepat di awal, lambat di akhir)
  - Opacity: 1 → 0 dari frame 80-140

  Tambah 20 partikel kecil (radius 1px) dengan distance lebih pendek (max 150px)
  untuk inner burst yang denser

PHASE 4: AFTERMATH (Frame 100-180)
- Partikel sudah memudar
- Center: teks residual muncul
  "ITEM SECURED" — "Share Tech Mono", 20px, #E8E8E8, letter-spacing 0.35em
  Fade in frame 100-115
  Glow subtle: drop-shadow(0 0 4px #E8E8E820)
- Beberapa "ember" partikel perlahan jatuh ke bawah (gravity feel):
  5 partikel kecil, mulai dari radius ~150px atas, translateY +300px lambat (80 frame)
  opacity 0.4→0, warna #FFD70060
```

---

## ═══ CATATAN EKSEKUSI ═══

### Urutan yang Disarankan
```
Mulai dari yang paling sederhana dulu untuk test pipeline:
1. Item 03 (Wave Progress Bar) — paling simpel, validasi setup Remotion
2. Item 04 (Resource Generator) — test partikel system
3. Item 01 (Hexagon Grid) — test SVG + stagger
4. Item 07 (Upgrade Panel) — test panel + bar animation
Setelah 4 ini jalan bagus, lanjut sisanya.
```

### Checklist Sebelum Export
```
□ Preview di browser minimal 3x loop — perhatikan frame pertama dan transisi loop
□ Font Share Tech Mono dan Rajdhani ter-load dengan benar
□ Glow effect visible dan tidak overblown
□ Tidak ada flash/glitch di frame pertama
□ Teks terbaca di semua frame
□ Durasi sesuai spec (cek frame count)
□ Export resolution 1920x1080 minimum
```

### Batch Render Command (Remotion CLI)
```bash
# Render satu komposisi
npx remotion render src/index.ts HexagonGridExpansion out/01-hexagon-grid.mp4

# Render semua sekaligus (buat script render-all.sh)
COMPOSITIONS=(
  "HexagonGridExpansion"
  "AutoTurretRange" 
  "EndlessWaveProgress"
  "IdleResourceGenerator"
  "TechTreeNode"
  "FloatingDamageNumbers"
  "UpgradePanel"
  "SpawnRadar"
  "EnergyShield"
  "MultiplierMeter"
  "PrestigeRebirth"
  "BossWarning"
  "OfflineEarnings"
  "CoreOverclock"
  "NeonLootDrop"
)

for comp in "${COMPOSITIONS[@]}"; do
  npx remotion render src/index.ts $comp out/$comp.mp4
done
```

---

*File ini dibuat untuk pipeline: Antigravity IDE → Remotion → Export MP4/MOV*
*Global Design System wajib diterapkan konsisten di semua 15 item*
