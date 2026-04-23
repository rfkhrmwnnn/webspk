# Dokumentasi Perhitungan Sistem Pendukung Keputusan (SPK) PKH
## Dataset: PABEDILAN_SP2D APRIL-JUNI 2025

Dokumen ini menjelaskan metodologi dan hasil perhitungan prioritas penerima bantuan Program Keluarga Harapan (PKH) menggunakan metode **TOPSIS** (Technique for Order of Preference by Similarity to Ideal Solution) berdasarkan data penyaluran dana.

### 1. Kriteria Perhitungan (Mapping dari Excel)
Berdasarkan data Excel yang diolah, kriteria yang digunakan untuk menentukan prioritas (urgensi) adalah:

| Kode | Kriteria | Sifat (Benefit/Cost) | Bobot | Penjelasan |
|------|----------|----------------------|-------|------------|
| C1 | Total Komponen | Benefit | 30% | Jumlah kategori bantuan yang dimiliki keluarga |
| C2 | Komponen Prioritas | Benefit | 25% | Fokus pada Disabilitas & Lansia |
| C3 | Anak Usia Dini (AUD) | Benefit | 20% | Prioritas tumbuh kembang anak |
| C4 | Pendidikan (SD/SMP/SMA) | Benefit | 15% | Fokus pada keberlanjutan sekolah |
| C5 | Nominal Bantuan | Cost | 10% | Jika nominal sudah besar, prioritas sedikit diturunkan untuk pemerataan |

### 2. Langkah-Langkah Metode TOPSIS

#### Langkah 1: Pembentukan Matriks Keputusan
Data dari Excel dikonversi menjadi matriks keputusan $X$. Setiap baris mewakili penerima (Alternatif) dan setiap kolom mewakili kriteria.

#### Langkah 2: Normalisasi Matriks ($R$)
Menghitung matriks normalisasi agar semua kriteria memiliki skala yang sama:
$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{i=1}^{m} x_{ij}^2}}$$

#### Langkah 3: Matriks Bobot Ternormalisasi ($Y$)
Mengalikan matriks $R$ dengan bobot kriteria ($w$):
$$y_{ij} = w_i \times r_{ij}$$

#### Langkah 4: Solusi Ideal Positif ($A^+$) dan Negatif ($A^-$)
- $A^+$: Nilai terbaik untuk setiap kriteria.
- $A^-$: Nilai terburuk untuk setiap kriteria.

#### Langkah 5: Jarak Solusi ($D^+$ dan $D^-$)
Menghitung seberapa jauh sebuah alternatif dari solusi ideal terbaik dan terburuk.

#### Langkah 6: Nilai Preferensi ($V$)
Nilai akhir yang menentukan peringkat:
$$V_i = \frac{D_i^-}{D_i^- + D_i^+}$$
*Nilai mendekati 1 menunjukkan prioritas lebih tinggi.*

### 3. Ringkasan Data Excel
- **Total Penerima**: 418 Keluarga
- **Total Dana Disalurkan**: Rp. 279.550.000 (Estimasi)
- **Komponen Tertinggi**: Anak Usia Dini (AUD) dan Lansia.

### 4. Visualisasi Hasil
(Lihat pada Dashboard Website bagian "Analisis Data Excel")

---
*Dibuat secara otomatis oleh Sistem Antigravity untuk SPK PKH Desa Pabedilan.*
