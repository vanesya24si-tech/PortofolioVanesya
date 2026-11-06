# ✳ Portofolio Vanesya Wilyan (Nezy)

Portofolio interaktif dan modern untuk **Vanesya Wilyan (Nezy)**, mahasiswi D4 Sistem Informasi di Politeknik Caltex Riau.

Situs web ini dirancang dengan gaya *brutalist modern / Gen Z aesthetic* yang dipadukan dengan interaktivitas tingkat lanjut: canvas generatif, simulasi fisika tali ID card (*Verlet physics*), kartu proyek 3D bertingkat (*stacking cards*), efek mesin tik, serta mode gelap/terang.

---

## 📁 Struktur Direktori Proyek

Proyek ini telah dimodularisasi agar rapi, profesional, dan mudah dikelola:

```text
portonesyanew/
├── index.html                  # File HTML utama (bersih, ringkas & semantik)
├── package.json                # Konfigurasi npm & run scripts
├── server.js                   # Development HTTP server (zero-dependency)
├── README.md                   # Panduan & dokumentasi proyek
├── .gitignore                  # Aturan ignore file build/OS/temporary
├── portfolio-nezy-v20.html     # Backup / arsip file HTML lama
│
└── assets/                     # Berkas statis modular
    ├── css/
    │   └── style.css           # Styling lengkap, tema, animasi, dan responsivitas
    │
    ├── images/                 # Gambar & aset visual hasil ekstraksi
    │   ├── netto-laundry.webp  # Aset visual proyek Netto Laundry
    │   ├── kesegaran-bayam.webp# Aset visual proyek Klasifikasi Bayam
    │   └── ujian-pertamina.webp# Aset visual proyek Portal Ujian Pertamina
    │
    └── js/
        ├── main.js             # Logika interaksi, cursor magnetik, clock, tilt 3D, typing
        ├── canvas.js           # Generative canvas visualizers untuk kartu proyek
        └── lanyard.js          # Simulasi fisika tali gantungan kartu ID interaktif
```

---

## 🚀 Cara Menjalankan

### Cara 1: Menggunakan Node.js (Disarankan)
Di terminal folder proyek, jalankan:
```bash
npm start
```
atau:
```bash
node server.js
```
Kemudian buka browser di: [http://localhost:3000](http://localhost:3000)

### Cara 2: Membuka File Langsung
Kamu juga bisa langsung membuka file `index.html` dengan klik ganda atau menggunakan peramban apa pun (Chrome, Edge, Firefox, Safari).

---

## ✨ Fitur-Fitur Utama

1. **Modular Codebase**: Pemisahan jelas antara Markup (HTML), Presentasi (CSS), dan Logika (JavaScript).
2. **Optimized Assets**: Gambar proyek telah diekstrak ke format `.webp` terpisah di folder `assets/images/`, mereduksi ukuran `index.html` hingga >90%.
3. **Interactive Lanyard**: Simulasi fisika Verlet rope yang bisa ditarik dan digerakkan dengan mouse/touch.
4. **Generative Canvas Cards**: Ilustrasi canvas hidup (gelombang, grafik bar, matriks, dan meteran).
5. **Adaptive Dark Mode**: Toggle mode terang/gelap yang tersinkronisasi.
6. **Magnetic & Sparkle Cursor**: Kursor dinamis yang merespons elemen tombol dan navigasi.
7. **Easter Egg**: Ketik `nezy` pada keyboard kapan saja untuk memicu ledakan konfeti ✨.
8. **Accessibility First**: Mendukung preferensi `prefers-reduced-motion` untuk aksesibilitas pengguna.
