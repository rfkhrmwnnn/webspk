import { useState, useMemo } from 'react';
import { Download, RefreshCw, Eye, Info } from 'lucide-react';
import tersanaData from '../data/tersana_data.json';
import { calculateTopsis } from '../utils/topsis';

const TopsisTable = ({ data, criteria, title, subtitle, isNormalized = false }) => (
  <div className="space-y-4">
    <div className="mb-4">
      <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      <p className="text-sm text-slate-500">{subtitle}</p>
    </div>
    <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
      <table className="w-full text-left border-collapse whitespace-nowrap">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase tracking-wider">
            <th className="py-4 px-4 font-bold">No</th>
            <th className="py-4 px-4 font-bold">Nama Pengurus</th>
            {criteria.map((c, i) => (
              <th key={i} className="py-4 px-4 font-bold text-center">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.slice(0, 20).map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50/50 transition-colors text-sm text-slate-700">
              <td className="py-3 px-4 text-slate-400 font-medium">{rowIndex + 1}</td>
              <td className="py-3 px-4 font-bold text-slate-900">{tersanaData[rowIndex]?.pengurus || '-'}</td>
              {row.map((val, colIndex) => (
                <td key={colIndex} className="py-3 px-4 text-center font-mono">
                  {isNormalized ? val.toFixed(4) : val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {data.length > 20 && (
      <p className="text-xs text-center text-slate-400 font-medium italic mt-4">
        Menampilkan 20 dari {data.length} baris data untuk performa optimal.
      </p>
    )}
  </div>
);

const TopsisResult = () => {
  const [activeTab, setActiveTab] = useState('ranking');

  const topsisData = useMemo(() => calculateTopsis(tersanaData), []);

  const rankingData = useMemo(() => {
    return topsisData.results.map((item, idx) => ({
      rank: idx + 1,
      name: item.pengurus,
      kk: item.no_kk,
      v: item.v,
      status: item.v > 0.6 ? 'Sangat Layak' : item.v > 0.3 ? 'Layak' : 'Cadangan'
    }));
  }, [topsisData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            Hasil Kalkulasi TOPSIS
            <span className="text-[10px] bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full uppercase tracking-widest font-black">Transparent Process</span>
          </h2>
          <p className="text-slate-500 mt-1 font-medium italic">Sistem menampilkan hasil akhir beserta langkah-langkah transparan perhitungan.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center shadow-sm transition-all">
            <RefreshCw className="w-4 h-4 mr-2" />
            Hitung Ulang
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center shadow-md transition-all">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100 bg-slate-50/30 px-4">
          <button 
            className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'ranking' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('ranking')}
          >
            Ranking Akhir (V)
            {activeTab === 'ranking' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'matrix' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('matrix')}
          >
            Matriks Keputusan
            {activeTab === 'matrix' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
          </button>
          <button 
            className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'normalized' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            onClick={() => setActiveTab('normalized')}
          >
            Matriks Normalisasi (R)
            {activeTab === 'normalized' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />}
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'ranking' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                    <th className="py-5 px-6 w-20">Rank</th>
                    <th className="py-5 px-6">Nama Kepala Keluarga</th>
                    <th className="py-5 px-6">Nilai Preferensi (V)</th>
                    <th className="py-5 px-6">Status Rekomendasi</th>
                    <th className="py-5 px-6 text-center">Analisis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rankingData.map((row) => (
                    <tr key={row.rank} className="hover:bg-indigo-50/30 text-sm text-slate-700 transition-colors group">
                      <td className="py-5 px-6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                          row.rank <= 3 ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {row.rank}
                        </div>
                      </td>
                      <td className="py-5 px-6">
                        <div>
                          <p className="font-bold text-slate-900">{row.name}</p>
                        </div>
                      </td>
                      <td className="py-5 px-6 font-mono font-bold text-indigo-600">
                        {row.v.toFixed(4)}
                      </td>
                      <td className="py-5 px-6">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${
                          row.status === 'Sangat Layak' ? 'bg-emerald-100 text-emerald-700' : 
                          row.status === 'Layak' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="py-5 px-6 text-center">
                        <button className="text-slate-300 hover:text-indigo-600 transition-colors" title="Lihat Penjelasan">
                          <Eye className="w-5 h-5 mx-auto" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'matrix' && (
            <TopsisTable 
              data={topsisData.matrix} 
              criteria={topsisData.criteria}
              title="Matriks Keputusan Awal"
              subtitle="Data mentah dari setiap komponen yang akan diproses."
            />
          )}

          {activeTab === 'normalized' && (
            <TopsisTable 
              data={topsisData.normalizedMatrix} 
              criteria={topsisData.criteria}
              title="Matriks Normalisasi (R)"
              subtitle="Hasil pembagian nilai dengan akar jumlah kuadrat baris (L2 Norm)."
              isNormalized={true}
            />
          )}
        </div>
      </div>

      <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 flex gap-4">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl h-fit">
          <Info className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-indigo-900 font-bold">Tentang Kalkulasi Ini</h4>
          <p className="text-indigo-700 text-sm mt-1 leading-relaxed font-medium">
            Kalkulasi ini menggunakan 7 kriteria dari data SP2D April-Juni 2025. Metode TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution) memberikan hasil peringkat berdasarkan jarak terdekat dengan solusi ideal positif dan jarak terjauh dari solusi ideal negatif.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TopsisResult;
