import { useState, useMemo } from 'react';
import { Play, TrendingUp, AlertCircle } from 'lucide-react';
import tersanaData from '../data/tersana_data.json';
import { calculateTopsis } from '../utils/topsis';

const WhatIfSimulator = () => {
  const [weights, setWeights] = useState({
    paud: 15, sd: 10, smp: 15, sma: 20, disabilitas: 20, lansia: 15, hamil: 5
  });

  const handleSliderChange = (e, key) => {
    setWeights({ ...weights, [key]: Number(e.target.value) });
  };

  const total = Object.values(weights).reduce((a, b) => a + b, 0);

  const originalResults = useMemo(() => calculateTopsis(tersanaData).results.slice(0, 3), []);
  
  const simulatedResults = useMemo(() => {
    if (total === 0) return [];
    // Convert percentage to decimal
    const normalizedWeights = {};
    Object.keys(weights).forEach(k => normalizedWeights[k] = weights[k] / 100);
    return calculateTopsis(tersanaData, normalizedWeights).results.slice(0, 3);
  }, [weights, total]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">Simulasi What-If (Perubahan Bobot)</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          Geser slider untuk melihat bagaimana perubahan bobot kriteria mempengaruhi ranking secara real-time.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <span className="font-medium text-sm">Total Bobot:</span>
              <span className={`font-bold ${total === 100 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {total}%
              </span>
            </div>

            {Object.entries(weights).map(([key, val]) => (
              <div key={key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 uppercase">{key}</span>
                  <span className="text-gray-500">{val}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={val}
                  onChange={(e) => handleSliderChange(e, key)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
              </div>
            ))}

            <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
              <Play className="w-4 h-4 mr-2" />
              Jalankan Simulasi
            </button>
          </div>

          {/* Results Comparison */}
          <div className="border border-gray-200 rounded-2xl p-6 bg-slate-50/50">
            <h3 className="text-sm font-bold text-slate-700 mb-6 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 mr-2 text-indigo-600" />
              Perbandingan Ranking (Top 3)
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <div className="text-[10px] font-black text-center text-slate-400 uppercase tracking-widest mb-2">Original</div>
                {originalResults.map((item, i) => (
                  <div key={i} className="bg-white p-3 border border-slate-100 rounded-xl text-sm shadow-sm flex items-center">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center font-bold text-xs mr-3">#{i+1}</span>
                    <span className="font-bold text-slate-700 truncate">{item.pengurus}</span>
                  </div>
                ))}
              </div>
              <div className="flex-1 space-y-3">
                <div className="text-[10px] font-black text-center text-indigo-600 uppercase tracking-widest mb-2">Simulasi</div>
                {simulatedResults.map((item, i) => (
                  <div key={i} className="bg-indigo-50/50 p-3 border border-indigo-100 text-indigo-900 rounded-xl text-sm shadow-sm flex items-center">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mr-3">#{i+1}</span>
                    <span className="font-bold truncate">{item.pengurus}</span>
                  </div>
                ))}
              </div>
            </div>
            {total !== 100 && (
              <div className="mt-8 p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed font-medium">
                  Perhatian: Total bobot saat ini adalah <strong>{total}%</strong>. Untuk hasil yang akurat, pastikan total bobot berjumlah <strong>100%</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
