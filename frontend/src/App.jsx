import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Package, ShoppingCart, Banknote } from 'lucide-react';

import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Inventory from './pages/Inventory';
import POS from './pages/POS';
import Expenses from './pages/Expenses';

function SidebarLink({ to, icon: Icon, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
        isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon size={20} className={isActive ? 'text-white' : 'text-slate-400'} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-slate-50 font-sans text-slate-800">
        {/* Sidebar */}
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">
          <div className="p-6 flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/30">M</div>
            <span className="text-2xl font-bold text-white tracking-tight">Manager<span className="text-indigo-500">Pro</span></span>
          </div>
          <nav className="flex-1 p-4 space-y-2 mt-4">
            <SidebarLink to="/" icon={LayoutDashboard} label="Dashboard" />
            <SidebarLink to="/pos" icon={ShoppingCart} label="Point of Sale" />
            <SidebarLink to="/inventory" icon={Package} label="Inventory" />
            <SidebarLink to="/employees" icon={Users} label="Employees" />
            <SidebarLink to="/expenses" icon={Banknote} label="Expenses" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/pos" element={<POS />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/expenses" element={<Expenses />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
