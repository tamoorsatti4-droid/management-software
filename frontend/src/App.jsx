import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Suppliers from './pages/Suppliers';
import Employees from './pages/Employees';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Ledger from './pages/Ledger';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 overflow-hidden">
        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Navbar */}
          <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<POS />} />
              <Route path="/products" element={<Products />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/ledger" element={<Ledger />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
