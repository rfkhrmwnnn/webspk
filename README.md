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

## Teknologi yang Digunakan
- **Frontend**: React.js, Vite, TailwindCSS, Lucide React, Recharts.
- **Backend**: Node.js, Express, XLSX (Excel Parser).
- **Metode**: TOPSIS (Multi-Criteria Decision Making).

---
© 2026 Sistem Pendukung Keputusan Penyaluran Bantuan Desa Tersana.
