import { useState, useMemo } from 'react';
import { Search, Filter, Upload, Plus } from 'lucide-react';
import tersanaData from '../data/tersana_data.json';

const AlternativesManager = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredData = useMemo(() => {
    return tersanaData.filter(item => 
      item.pengurus.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const displayData = filteredData.slice(0, 50); // Show top 50 for performance

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Data Warga (Alternatif)</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola data calon penerima bantuan dan nilai evaluasinya.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </button>
          <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Cari Nama..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>
        <button className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center gap-2 text-sm font-medium">
          <Filter className="w-4 h-4" />
          <span>Showing {displayData.length} of {filteredData.length}</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4 font-medium">Nama Kepala Keluarga</th>
              <th className="py-3 px-4 font-medium text-center">C1</th>
              <th className="py-3 px-4 font-medium text-center">C2</th>
              <th className="py-3 px-4 font-medium text-center">C3</th>
              <th className="py-3 px-4 font-medium text-center">C4</th>
              <th className="py-3 px-4 font-medium text-center">C5</th>
              <th className="py-3 px-4 font-medium text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {displayData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700">
                <td className="py-3 px-4">{row.pengurus}</td>
                <td className="py-3 px-4 text-center">{row.aud}</td>
                <td className="py-3 px-4 text-center">{row.sd}</td>
                <td className="py-3 px-4 text-center">{row.smp}</td>
                <td className="py-3 px-4 text-center">{row.sma}</td>
                <td className="py-3 px-4 text-center">{row.lansia}</td>
                <td className="py-3 px-4 text-right font-bold text-indigo-600">Rp {row.nominal.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AlternativesManager;
