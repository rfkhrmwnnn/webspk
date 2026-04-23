import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';

const CriteriaManager = () => {
  const [criteria, setCriteria] = useState([]);
  
  // Dummy data representing API response
  useEffect(() => {
    setCriteria([
      { id: 1, code: 'C1', name: 'Anak Usia Dini (AUD)', weight: 15, type: 'Benefit' },
      { id: 2, code: 'C2', name: 'Siswa SD', weight: 10, type: 'Benefit' },
      { id: 3, code: 'C3', name: 'Siswa SMP', weight: 15, type: 'Benefit' },
      { id: 4, code: 'C4', name: 'Siswa SMA', weight: 20, type: 'Benefit' },
      { id: 5, code: 'C5', name: 'Lanjut Usia (Lansia)', weight: 15, type: 'Benefit' },
      { id: 6, code: 'C6', name: 'Disabilitas', weight: 20, type: 'Benefit' },
      { id: 7, code: 'C7', name: 'Ibu Hamil', weight: 5, type: 'Benefit' },
    ]);
  }, []);

  const totalWeight = criteria.reduce((sum, item) => sum + Number(item.weight), 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Manajemen Kriteria</h2>
          <p className="text-sm text-gray-500 mt-1">Kelola kriteria, bobot, dan atribut untuk perhitungan TOPSIS.</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kriteria
        </button>
      </div>

      {/* Warning if weight != 100 */}
      {totalWeight !== 100 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-center">
          <span className="font-semibold mr-2">Peringatan:</span> Total bobot saat ini adalah {totalWeight}%. Idealnya total bobot adalah 100%.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
              <th className="py-3 px-4 font-medium">Kode</th>
              <th className="py-3 px-4 font-medium">Nama Kriteria</th>
              <th className="py-3 px-4 font-medium">Bobot (%)</th>
              <th className="py-3 px-4 font-medium">Atribut</th>
              <th className="py-3 px-4 font-medium text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {criteria.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{c.code}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{c.name}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{c.weight}</td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    c.type === 'Benefit' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {c.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right">
                  <button className="text-blue-600 hover:text-blue-800 p-1 mr-2" title="Edit">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 p-1" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CriteriaManager;
