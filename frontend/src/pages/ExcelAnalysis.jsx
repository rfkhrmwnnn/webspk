import React, { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FileText, Users, CreditCard, TrendingUp, AlertCircle } from 'lucide-react';
import tersanaData from '../data/tersana_data.json';
const excelData = tersanaData; // Use tersanaData as the source for excelData


const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];

const ExcelAnalysis = () => {
  const stats = useMemo(() => {
    const totalRecipients = excelData.length;
    const totalNominal = excelData.reduce((acc, curr) => acc + curr.nominal, 0);
    const avgNominal = totalNominal / totalRecipients;
    
    const componentCounts = {
      paud: excelData.reduce((acc, curr) => acc + curr.aud, 0),
      sd: excelData.reduce((acc, curr) => acc + curr.sd, 0),
      smp: excelData.reduce((acc, curr) => acc + curr.smp, 0),
      sma: excelData.reduce((acc, curr) => acc + curr.sma, 0),
      lansia: excelData.reduce((acc, curr) => acc + curr.lansia, 0),
    };

    const pieData = Object.entries(componentCounts).map(([name, value]) => ({
      name: name.toUpperCase(),
      value
    }));

    return { totalRecipients, totalNominal, avgNominal, componentCounts, pieData };
  }, []);

  const nominalDistribution = useMemo(() => {
    const groups = {};
    excelData.forEach(item => {
      const range = Math.floor(item.nominal / 250000) * 250000;
      const label = `Rp ${(range/1000).toLocaleString()}k - ${((range+250000)/1000).toLocaleString()}k`;
      groups[label] = (groups[label] || 0) + 1;
    });
    return Object.entries(groups).map(([name, count]) => ({ name, count }));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Analisis Data Excel SP2D</h1>
          <p className="text-slate-500 mt-1">Visualisasi data penyaluran bantuan sosial Desa Pabedilan</p>
        </div>
        <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium border border-indigo-100">
          <FileText className="w-4 h-4" />
          PABEDILAN_SP2D_2025.xlsx
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Penerima</p>
            <p className="text-2xl font-bold text-slate-900">{stats.totalRecipients.toLocaleString()} PKH</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Dana Disalurkan</p>
            <p className="text-2xl font-bold text-slate-900">Rp {stats.totalNominal.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 bg-indigo-100 text-indigo-600 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Rata-rata Bantuan</p>
            <p className="text-2xl font-bold text-slate-900">Rp {Math.round(stats.avgNominal).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Component Breakdown Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Distribusi Komponen PKH</h3>
            <p className="text-slate-500 text-sm">Jumlah individu per kategori bantuan</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Nominal Distribution Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Sebaran Nominal Bantuan</h3>
            <p className="text-slate-500 text-sm">Jumlah keluarga berdasarkan rentang nominal</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={nominalDistribution}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} tick={{fill: '#64748b'}} />
                <YAxis fontSize={12} tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Priority Table (Simulated ranking) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Daftar Penerima Tersana (Sampel 10 Data Pertama)</h3>
            <p className="text-slate-500 text-sm mt-1">Data hasil ekstraksi sheet TERSANA</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">No</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nama Pengurus</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Komp</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">PAUD</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Lansia</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {excelData.slice(0, 10).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4 text-sm font-medium text-slate-400 group-hover:text-slate-900 transition-colors">{row.no}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{row.pengurus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {row.komponen} Komponen
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{row.aud}</td>
                  <td className="px-6 py-4 text-center text-sm text-slate-600">{row.lansia}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-indigo-600">Rp {row.nominal.toLocaleString('id-ID')}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-4">
        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0" />
        <div>
          <h4 className="text-amber-800 font-bold">Catatan Dokumentasi</h4>
          <p className="text-amber-700 text-sm mt-1">
            Data di atas diekstraksi langsung dari file Excel penyaluran dana. Perhitungan prioritas pada sistem SPK utama menggunakan variabel tambahan seperti Pendapatan dan Kondisi Rumah yang diverifikasi melalui survei lapangan untuk menjamin ketepatan sasaran.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExcelAnalysis;
