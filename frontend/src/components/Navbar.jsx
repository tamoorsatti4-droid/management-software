import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, Sun, Moon, Menu, ChevronDown, Check, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const mockNotifications = [
  { id: 1, type: 'warning', msg: "Low stock: 'Cement' has only 3 units left.", time: '2m ago', read: false },
  { id: 2, type: 'success', msg: "Sale #1042 completed — PKR 12,500.", time: '15m ago', read: false },
  { id: 3, type: 'info', msg: "Monthly report is ready to export.", time: '1h ago', read: true },
  { id: 4, type: 'warning', msg: "Salary for March not yet processed.", time: '3h ago', read: true },
];

const typeColors = {
  warning: 'bg-amber-500',
  success: 'bg-emerald-500',
  info: 'bg-blue-500',
  error: 'bg-rose-500',
};

export default function Navbar({ onMenuClick }) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, lang, toggleLanguage, dir } = useLanguage();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [searchVal, setSearchVal] = useState('');

  const getPageName = () => {
    const names = {
      '/': t('dashboard'),
      '/pos': t('pos'),
      '/products': t('products'),
      '/inventory': t('inventory'),
      '/customers': t('customers'),
      '/suppliers': t('suppliers'),
      '/employees': t('employees'),
      '/expenses': t('expenses'),
      '/reports': t('reports'),
      '/settings': t('settings'),
      '/ledger': t('ledger'),
    };
    return names[location.pathname] || t('dashboard');
  };

  const pageName = getPageName();
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center gap-4 px-4 md:px-6
      bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
      border-b border-slate-200 dark:border-slate-800 shadow-sm">

      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
      >
        <Menu size={20} />
      </button>

      {/* Page title */}
      <div className="hidden md:block">
        <h1 className={`text-lg font-bold text-slate-800 dark:text-white tracking-tight ${lang === 'ur' ? 'font-urdu' : ''}`}>{pageName}</h1>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-sm ml-4 hidden sm:block">
        <div className="relative">
          <Search className={`${dir === 'rtl' ? 'right-3' : 'left-3'} absolute top-1/2 -translate-y-1/2 text-slate-400`} size={16} />
          <input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchVal}
            onChange={e => setSearchVal(e.target.value)}
            className={`w-full ${dir === 'rtl' ? 'pr-9 pl-4 text-right' : 'pl-9 pr-4'} py-2 text-sm rounded-xl
              bg-slate-100 dark:bg-slate-800
              border border-slate-200 dark:border-slate-700
              text-slate-700 dark:text-slate-200
              placeholder-slate-400 dark:placeholder-slate-500
              focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500
              transition ${lang === 'ur' ? 'font-urdu' : ''}`}
          />
        </div>
      </div>

      <div className={`${dir === 'rtl' ? 'mr-auto' : 'ml-auto'} flex items-center gap-2`}>
        {/* Language toggle */}
        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center gap-2 border border-slate-200 dark:border-slate-700"
        >
          <div className="w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] text-white">
            {lang === 'en' ? 'EN' : 'اردو'}
          </div>
          <span className={lang === 'en' ? 'font-urdu' : ''}>{lang === 'en' ? t('switchUrdu') : t('switchEnglish')}</span>
        </button>
        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Bell size={18} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse-glow ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-50 animate-fade-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                <span className="font-bold text-sm text-slate-800 dark:text-white">Notifications</span>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center gap-1">
                      <Check size={12} /> Mark all read
                    </button>
                  )}
                  <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <X size={16} />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className={`flex gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition ${!n.read ? 'bg-indigo-50/40 dark:bg-indigo-950/20' : ''}`}>
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${typeColors[n.type]}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{n.msg}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2 pl-2 ml-1 border-l border-slate-200 dark:border-slate-700">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold cursor-pointer shadow-md">
            A
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-tight">Admin</p>
            <p className="text-[10px] text-slate-400">admin@managerpro.io</p>
          </div>
          <ChevronDown size={14} className="text-slate-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
}
