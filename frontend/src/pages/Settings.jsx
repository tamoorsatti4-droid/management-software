import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe, Database, HelpCircle, Save, Moon, Sun, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t, lang, dir } = useLanguage();
  const [activeSection, setActiveSection] = useState('Profile');
  const [saveStatus, setSaveStatus] = useState(false);

  const sections = [
    { id: 'Profile', name: t('profile'), icon: User, desc: t('profileDesc') },
    { id: 'Notifications', name: t('notifications'), icon: Bell, desc: t('notificationsDesc') },
    { id: 'Security', name: t('security'), icon: Shield, desc: t('securityDesc') },
    { id: 'Appearance', name: t('appearance'), icon: Palette, desc: t('themeDesc') },
    { id: 'Business', name: t('businessName'), icon: Database, desc: t('settingsDesc') },
    { id: 'Help', name: t('help'), icon: HelpCircle, desc: t('helpDesc') },
  ];

  const handleSave = () => {
    setSaveStatus(true);
    setTimeout(() => setSaveStatus(false), 3000);
  };

  return (
    <div className={`p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto space-y-6 page-enter ${lang === 'ur' ? 'font-urdu' : ''}`}>
      <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        <div className={dir === 'rtl' ? 'text-right' : ''}>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-lg">
              <SettingsIcon size={22} />
            </div>
            {t('settings')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configure your dashboard and application preferences.</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}
        >
          {saveStatus ? <CheckCircle size={18} /> : <Save size={18} />}
          {saveStatus ? (lang === 'ur' ? 'محفوظ ہو گیا' : 'Changes Saved') : t('save')}
        </button>
      </div>

      <div className={`flex flex-col lg:flex-row gap-8 mt-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-72 space-y-2 shrink-0">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${dir === 'rtl' ? 'flex-row-reverse' : ''} ${
                activeSection === section.id
                  ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-900/40 shadow-sm text-indigo-600 dark:text-indigo-400'
                  : 'bg-transparent border-transparent text-slate-500 hover:bg-white dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className={`p-2 rounded-xl ${activeSection === section.id ? 'bg-indigo-50 dark:bg-indigo-950/40' : 'bg-slate-100 dark:bg-slate-800'}`}>
                <section.icon size={20} strokeWidth={activeSection === section.id ? 2.5 : 2} />
              </div>
              <div className={dir === 'rtl' ? 'text-right' : 'text-left'}>
                <p className="font-bold text-sm leading-tight">{section.name}</p>
                <p className="text-[10px] text-slate-400 font-medium leading-none mt-1">{section.desc}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[500px]">
          {activeSection === 'Profile' && (
            <div className="space-y-8 animate-fade-in">
              <div className={`flex items-center gap-6 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-xl">
                    A
                  </div>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                    <Palette size={20} className="text-white" />
                  </div>
                </div>
                <div className={dir === 'rtl' ? 'text-right' : ''}>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">Administrator User</h3>
                  <p className="text-sm text-slate-500">Super Admin • Joined March 2026</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="space-y-2">
                  <label className={`text-xs font-bold text-slate-400 uppercase tracking-widest block ${dir === 'rtl' ? 'text-right' : 'ml-1'}`}>Full Name</label>
                  <input type="text" defaultValue="Hafiz Admin" className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${dir === 'rtl' ? 'text-right' : ''}`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold text-slate-400 uppercase tracking-widest block ${dir === 'rtl' ? 'text-right' : 'ml-1'}`}>{t('email')}</label>
                  <input type="email" defaultValue="admin@managerpro.io" className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${dir === 'rtl' ? 'text-right' : ''}`} />
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold text-slate-400 uppercase tracking-widest block ${dir === 'rtl' ? 'text-right' : 'ml-1'}`}>Job Role</label>
                  <select className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${dir === 'rtl' ? 'text-right' : ''}`}>
                    <option>Administrator</option>
                    <option>Manager</option>
                    <option>Inventory Incharge</option>
                    <option>Sales Staff</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className={`text-xs font-bold text-slate-400 uppercase tracking-widest block ${dir === 'rtl' ? 'text-right' : 'ml-1'}`}>Shop/Factory Name</label>
                  <input type="text" defaultValue="Tamoor Heavy Industries" className={`w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition ${dir === 'rtl' ? 'text-right' : ''}`} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'Appearance' && (
            <div className="space-y-8 animate-fade-in">
              <div className={dir === 'rtl' ? 'text-right' : ''}>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Interface Theme</h3>
                <p className="text-sm text-slate-500 mb-6">Choose how the dashboard looks on your device.</p>

                <div className={`grid grid-cols-2 gap-4 max-w-md ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                  <button
                    onClick={() => darkMode && toggleDarkMode()}
                    className={`p-4 rounded-3xl border-2 transition-all ${dir === 'rtl' ? 'text-right' : 'text-left'} ${!darkMode ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-slate-200'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4"><Sun size={20} className="text-amber-500" /></div>
                    <p className="font-bold text-slate-800 dark:text-white">{t('lightMode')}</p>
                    <p className="text-xs text-slate-400 mt-1">Clean and professional</p>
                  </button>
                  <button
                    onClick={() => !darkMode && toggleDarkMode()}
                    className={`p-4 rounded-3xl border-2 transition-all ${dir === 'rtl' ? 'text-right' : 'text-left'} ${darkMode ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 hover:border-slate-200'}`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 shadow-sm flex items-center justify-center mb-4"><Moon size={20} className="text-indigo-400" /></div>
                    <p className="font-bold text-slate-800 dark:text-white">{t('darkMode')}</p>
                    <p className="text-xs text-slate-400 mt-1">Eye-friendly and sleek</p>
                  </button>
                </div>
              </div>

              <div className={dir === 'rtl' ? 'text-right' : ''}>
                 <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Sidebar Prefences</h3>
                 <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-12 h-6 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute top-1 right-1 w-4 h-4 bg-white rounded-full shadow-sm" /></div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Expand sidebar by default</span>
                 </div>
              </div>
            </div>
          )}

          {activeSection !== 'Profile' && activeSection !== 'Appearance' && (
             <div className="flex flex-col items-center justify-center py-20 text-slate-400 h-full">
                <SettingsIcon size={48} className="mb-4 opacity-20 animate-spin transition-duration-[5000ms]" />
                <p className="font-medium text-center">Section {activeSection} is under maintenance.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
