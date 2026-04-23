import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CriteriaManager from './pages/CriteriaManager';
import AlternativesManager from './pages/AlternativesManager';
import TopsisResult from './pages/TopsisResult';
import WhatIfSimulator from './pages/WhatIfSimulator';
import ExcelAnalysis from './pages/ExcelAnalysis';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="excel-analysis" element={<ExcelAnalysis />} />
          <Route path="criteria" element={<CriteriaManager />} />
          <Route path="alternatives" element={<AlternativesManager />} />
          <Route path="calculation" element={<TopsisResult />} />
          <Route path="simulation" element={<WhatIfSimulator />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
