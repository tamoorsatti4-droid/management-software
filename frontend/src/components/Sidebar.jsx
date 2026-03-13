import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Package, Boxes, Users, Truck,
  UserCheck, Receipt, BarChart3, Settings, ChevronRight, X, Zap,
  Notebook
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

function NavItem({ item, onClick }) {
  const location = useLocation();
  const { lang, dir } = useLanguage();
  const isActive = location.pathname === item.to || (item.to === '/dashboard' && location.pathname === '/');
  const Icon = item.icon;

  return (
    <Link
      to={item.to}
      onClick={onClick}
      className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative ${
        isActive
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white dark:text-slate-400 dark:hover:bg-slate-700/60'
      }`}
    >
      {isActive && (
        <span className={`absolute ${dir === 'rtl' ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full`} />
      )}
      <Icon size={18} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'} transition-colors`} />
      <div className="flex flex-col min-w-0">
        <span className={`${lang === 'ur' ? 'font-urdu' : ''} truncate leading-tight`}>{item.label}</span>
        {item.desc && (
          <span className={`text-[9px] opacity-60 font-medium truncate leading-none mt-0.5 ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {item.desc}
          </span>
        )}
      </div>
      {isActive && <ChevronRight size={14} className={`${dir === 'rtl' ? 'mr-auto rotate-180' : 'ml-auto'} text-white/70`} />}
    </Link>
  );
}

export default function Sidebar({ open, onClose }) {
  const { t, dir, lang } = useLanguage();

  const navItems = [
    { to: '/', icon: LayoutDashboard, label: t('dashboard'), desc: t('dashboardDesc') },
    { to: '/pos', icon: ShoppingCart, label: t('pos'), desc: t('posDesc') },
    { to: '/ledger', icon: Notebook, label: t('ledger'), desc: t('ledgerDesc') },
    { to: '/products', icon: Package, label: t('products'), desc: t('productsDesc') },
    { to: '/inventory', icon: Boxes, label: t('inventory'), desc: t('inventoryDesc') },
    { to: '/customers', icon: Users, label: t('customers'), desc: t('customersDesc') },
    { to: '/suppliers', icon: Truck, label: t('suppliers'), desc: t('suppliersDesc') },
    { to: '/employees', icon: UserCheck, label: t('employees'), desc: t('employeesDesc') },
    { to: '/expenses', icon: Receipt, label: t('expenses'), desc: t('expensesDesc') },
    { to: '/reports', icon: BarChart3, label: t('reports'), desc: t('reportsDesc') },
    { to: '/settings', icon: Settings, label: t('settings'), desc: t('settingsDesc') },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="sidebar-overlay lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 ${dir === 'rtl' ? 'right-0' : 'left-0'} h-full z-50 w-64
          bg-slate-900 dark:bg-slate-950
          flex flex-col border-r border-slate-800 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : (dir === 'rtl' ? 'translate-x-full' : '-translate-x-full')}
          lg:translate-x-0 lg:static lg:z-auto
          animate-slide-left
        `}
      >
        {/* Brand */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Zap size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div className={lang === 'ur' ? 'font-urdu' : ''}>
              <span className="text-white font-bold text-lg tracking-tight">Manager</span>
              <span className="text-indigo-400 font-bold text-lg">Pro</span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-800/60 rounded-lg">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-bold">A</div>
            <div className={lang === 'ur' ? 'font-urdu' : ''}>
              <p className="text-white text-[10px] font-semibold">Admin User</p>
              <p className="text-slate-500 text-[8px]">Administrator</p>
            </div>
            <span className={`ml-auto text-[8px] font-semibold bg-indigo-900/80 text-indigo-300 px-2 py-0.5 rounded-full ${lang === 'ur' ? 'font-urdu' : ''}`}>Admin</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <p className={`text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-2 pb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {t('mainMenu')}
          </p>
          {navItems.slice(0, 6).map(item => (
            <NavItem key={item.to} item={item} onClick={onClose} />
          ))}
          <p className={`text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 pt-4 pb-1 ${lang === 'ur' ? 'font-urdu' : ''}`}>
            {t('management')}
          </p>
          {navItems.slice(6).map(item => (
            <NavItem key={item.to} item={item} onClick={onClose} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
          <div className="rounded-xl bg-gradient-to-br from-indigo-900/60 to-purple-900/60 p-3 border border-indigo-800/40">
            <p className="text-indigo-300 text-xs font-semibold">ManagerPro v2.0</p>
            <p className="text-slate-500 text-[10px] mt-0.5">© 2026 All rights reserved</p>
          </div>
        </div>
      </aside>
    </>
  );
}
