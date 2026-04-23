import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, SlidersHorizontal, Calculator, FileOutput } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analisis Excel', href: '/excel-analysis', icon: FileOutput },
    { name: 'Data Kriteria', href: '/criteria', icon: SlidersHorizontal },
    { name: 'Data Warga', href: '/alternatives', icon: Users },
    { name: 'Kalkulasi TOPSIS', href: '/calculation', icon: Calculator },
    { name: 'Simulasi What-If', href: '/simulation', icon: FileOutput },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary-600">SPK PKH</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => {
              const isActive = location.pathname.startsWith(item.href);
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-primary-700' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-200 text-xs text-center text-gray-500">
          Sistem Pendukung Keputusan &copy; 2026
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-lg font-medium text-gray-800 capitalize">
            {location.pathname.split('/')[1].replace('-', ' ')}
          </h2>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              Admin Mode
            </span>
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8 bg-gray-50/50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
