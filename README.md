# SPK PKH - Sistem Pendukung Keputusan Penyaluran Bantuan

Sistem Pendukung Keputusan (SPK) untuk penentuan prioritas penerima bantuan Program Keluarga Harapan (PKH) menggunakan metode **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution). Data utama diekstraksi dari file Excel SP2D April-Juni 2025.

## Fitur Utama
- **Dashboard Monitoring**: Visualisasi statistik real-time dari data Tersana.
- **Analisis Excel**: Ekstraksi dan breakdown data langsung dari sheet "TERSANA".
- **Kalkulasi TOPSIS**: Perhitungan peringkat transparan dengan matriks keputusan dan normalisasi.
- **Simulasi What-If**: Simulasi perubahan bobot kriteria untuk melihat dampak perubahan ranking.
- **Manajemen Kriteria**: Pengaturan bobot untuk 7 komponen PKH (AUD, SD, SMP, SMA, Lansia, Disabilitas, Hamil).

## Persyaratan Sistem
- [Node.js](https://nodejs.org/) (versi 16 atau lebih baru)
- npm (biasanya terinstal bersama Node.js)

## Cara Menjalankan Aplikasi

### 1. Persiapan Data (Opsional)
Data sudah tersedia di dalam folder `frontend/src/data`. Jika Anda ingin memperbarui data dari file Excel terbaru, jalankan script ekstraksi:

```bash
cd backend
npm install
node src/scripts/extract_tersana.js
```

### 2. Menjalankan Backend
Backend digunakan untuk memproses data dan menyediakan API (meskipun versi saat ini sudah dioptimalkan untuk berjalan secara mandiri di frontend).

```bash
cd backend
npm install
npm run dev
```
Backend akan berjalan di: `http://localhost:5000`

### 3. Menjalankan Frontend
Frontend adalah antarmuka utama sistem.

```bash
cd frontend
npm install
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

## Struktur Folder
- `backend/`: Script ekstraksi data dan server API.
- `frontend/`: Aplikasi React (Vite + TailwindCSS + Recharts).
- `PABEDILAN_SP2D APRIL-JUNI 2025.xlsx`: Sumber data utama.

## Penjelasan Tampilan Website

Aplikasi ini dirancang untuk mempermudah pengambilan keputusan dan menganalisis data penyaluran bantuan sosial. Secara keseluruhan, sistem terdiri dari 6 halaman utama:

### 1. Dashboard (`Dashboard.jsx`)
**Fungsi Utama:** Memberikan ringkasan informasi secara menyeluruh (High-level overview).
- Menampilkan kartu ringkasan metrik utama (misalnya: total warga terdaftar, total kriteria, ringkasan dana).
- Memberikan pintasan (shortcut) ke fitur-fitur utama lainnya.
- Bertindak sebagai "Home" atau beranda saat pengguna pertama kali masuk ke dalam sistem.

### 2. Analisis Data Excel (`ExcelAnalysis.jsx`)
**Fungsi Utama:** Menampilkan visualisasi data analitik yang diekstrak langsung dari file Excel penyaluran bantuan (SP2D).
- **Statistik Global:** Menampilkan total penerima bantuan (KPM), total dana yang disalurkan, dan rata-rata nominal bantuan per orang.
- **Distribusi Komponen:** Berupa grafik (*Pie Chart*) yang memperlihatkan proporsi jumlah individu per kategori komponen (AUD, SD, SMP, SMA, Lansia, Disabilitas, Hamil).
- **Sebaran Nominal Bantuan:** Berupa grafik (*Bar Chart*) yang mengelompokkan penerima berdasarkan rentang nominal uang yang diterima.
- **Tabel Sampel Data:** Menampilkan cuplikan data hasil ekstraksi dari sheet TERSANA sebagai referensi cepat (tanpa nomor KK untuk menjaga privasi).

### 3. Kelola Data Warga / Alternatif (`AlternativesManager.jsx`)
**Fungsi Utama:** Mengelola data penduduk yang menjadi calon/penerima bantuan (Alternatif).
- Menampilkan tabel berisi nama kepala keluarga beserta jumlah dari masing-masing komponen yang dimiliki (C1 hingga C7) serta total nominal bantuan.
- Menyediakan fitur pencarian warga berdasarkan nama untuk mempermudah pengecekan data spesifik.
- Merupakan data mentah (*decision matrix*) sebelum diproses oleh algoritma.

### 4. Kelola Kriteria (`CriteriaManager.jsx`)
**Fungsi Utama:** Menentukan variabel penentu (Kriteria) serta bobot tingkat kepentingannya dalam perhitungan SPK.
- Pengguna dapat melihat kriteria apa saja yang digunakan (contoh: Lansia, Disabilitas, Anak Usia Dini, dll).
- Pengguna dapat menentukan tipe kriteria tersebut, apakah termasuk *Benefit* (semakin besar semakin baik) atau *Cost* (semakin kecil semakin baik).
- Memberikan bobot persentase untuk setiap kriteria yang nantinya akan dipakai oleh metode TOPSIS.

### 5. Hasil Kalkulasi TOPSIS (`TopsisResult.jsx`)
**Fungsi Utama:** Menjalankan algoritma TOPSIS dan menampilkan hasil rekomendasi secara transparan.
- **Ranking Akhir (V):** Mengurutkan warga berdasarkan nilai preferensi tertinggi (jarak terdekat dengan solusi ideal positif). Menampilkan status kelayakan seperti "Sangat Layak", "Layak", atau "Cadangan".
- **Matriks Keputusan:** Menampilkan data matriks awal dari semua warga untuk tiap kriteria.
- **Matriks Normalisasi (R):** Menampilkan matriks data yang nilainya sudah dinormalisasi (dibagi dengan akar jumlah kuadrat) sehingga skala datanya seragam dan transparan proses perhitungannya.

### 6. Simulasi What-If (`WhatIfSimulator.jsx`)
**Fungsi Utama:** Memungkinkan pengambil keputusan untuk melakukan simulasi (uji coba) pengubahan bobot tanpa merusak data aslinya.
- Pengguna dapat mengubah-ubah *slider* bobot kriteria untuk melihat bagaimana perubahan prioritas pemerintah (misal: lebih memprioritaskan Lansia dibanding Anak Sekolah) akan memengaruhi peringkat penerima bantuan.
- Sangat berguna untuk evaluasi kebijakan secara fleksibel sebelum menetapkan keputusan akhir.

## Teknologi yang Digunakan
- **Frontend**: React.js, Vite, TailwindCSS, Lucide React, Recharts.
- **Backend**: Node.js, Express, XLSX (Excel Parser).
- **Metode**: TOPSIS (Multi-Criteria Decision Making).

---
© 2026 Sistem Pendukung Keputusan Penyaluran Bantuan Desa Tersana.
