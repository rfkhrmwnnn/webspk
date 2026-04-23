import { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Target, ShieldCheck, AlertTriangle, CreditCard, PieChart as PieChartIcon } from 'lucide-react';
import tersanaData from '../data/tersana_data.json';

const StatCard = ({ title, value, icon: Icon, colorClass }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center hover:shadow-md transition-shadow">
    <div className={`p-4 rounded-xl ${colorClass} mr-5 shadow-sm`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const stats = useMemo(() => {
    const totalRecipients = tersanaData.length;
    const totalNominal = tersanaData.reduce((sum, item) => sum + (item.nominal || 0), 0);
    const avgNominal = totalNominal / totalRecipients;
    
    // Count anomalies (e.g., missing nominal or no components)
    const anomalies = tersanaData.filter(item => 
      !item.nominal || 
      (item.aud === 0 && item.sd === 0 && item.smp === 0 && item.sma === 0 && 
       item.disabilitas === 0 && item.lansia === 0 && item.hamil === 0)
    ).length;

    return [
      { title: 'Total Penerima (KPM)', value: totalRecipients.toLocaleString(), icon: Users, color: 'bg-blue-600' },
      { title: 'Total Dana SP2D', value: `Rp ${totalNominal.toLocaleString('id-ID')}`, icon: CreditCard, color: 'bg-emerald-600' },
      { title: 'Rata-rata Bantuan', value: `Rp ${Math.round(avgNominal).toLocaleString('id-ID')}`, icon: Target, color: 'bg-indigo-600' },
      { title: 'Anomali Data', value: anomalies.toLocaleString(), icon: AlertTriangle, color: 'bg-amber-600' },
    ];
  }, []);

  const chartData = useMemo(() => {
    const groups = {};
    tersanaData.forEach(item => {
      const nominal = item.nominal || 0;
      let label = '';
      if (nominal < 500000) label = '< 500k';
      else if (nominal < 1000000) label = '500k - 1M';
      else if (nominal < 1500000) label = '1M - 1.5M';
      else label = '> 1.5M';
      
      groups[label] = (groups[label] || 0) + 1;
    });

    const order = ['< 500k', '500k - 1M', '1M - 1.5M', '> 1.5M'];
    return order.map(label => ({
      range: label,
      count: groups[label] || 0
    }));
  }, []);

  const topCandidates = useMemo(() => {
    return [...tersanaData]
      .sort((a, b) => (b.nominal || 0) - (a.nominal || 0))
      .slice(0, 5)
      .map(item => ({
        id: item.no,
        name: item.pengurus,
        score: item.nominal.toLocaleString('id-ID'),
        status: item.nominal > 1000000 ? 'Prioritas Tinggi' : 'Prioritas Medium'
      }));
  }, []);

  const componentStats = useMemo(() => {
    const totals = {
      'Anak Usia Dini': tersanaData.reduce((sum, i) => sum + (i.aud || 0), 0),
      'SD': tersanaData.reduce((sum, i) => sum + (i.sd || 0), 0),
      'SMP': tersanaData.reduce((sum, i) => sum + (i.smp || 0), 0),
      'SMA': tersanaData.reduce((sum, i) => sum + (i.sma || 0), 0),
      'Lansia': tersanaData.reduce((sum, i) => sum + (i.lansia || 0), 0),
      'Disabilitas': tersanaData.reduce((sum, i) => sum + (i.disabilitas || 0), 0),
    };
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Tersana</h1>
          <p className="text-slate-500 mt-1 font-medium">Monitoring Penyaluran SP2D April-Juni 2025</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-bold border border-blue-100 shadow-sm">
          <ShieldCheck className="w-4 h-4" />
          Data Terverifikasi
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} title={s.title} value={s.value} icon={s.icon} colorClass={s.color} />
        ))}
      </div>

      {/* Main Content Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Distribusi Nominal Bantuan</h3>
              <p className="text-sm text-slate-500">Jumlah KPM berdasarkan rentang dana yang diterima</p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={60}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#6366f1'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top List */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Prioritas Teratas</h3>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full uppercase tracking-wider">Bantuan Tertinggi</span>
          </div>
          <div className="space-y-4">
            {topCandidates.map((c, idx) => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:bg-white hover:border-blue-200 transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{c.name}</p>
                    <p className="text-xs text-slate-500 font-medium">Rp {c.score}</p>
                  </div>
                </div>
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tight ${
                  c.status === 'Prioritas Tinggi' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component Statistics Row */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-8">Statistik Komponen Individu</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {componentStats.map((comp, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 text-center hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{comp.name}</p>
              <p className="text-2xl font-black text-indigo-600">{comp.value}</p>
              <p className="text-[10px] text-slate-400 mt-1 font-medium">Jiwa Terdaftar</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
